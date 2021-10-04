import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Note } from "../entities/Note";
import { Post } from "../entities/Post";
import { isAuth } from "../isAuth";
import { MyContext } from "../utils/types";
import { validateCreatePost } from "../utils/validateCreatePost";
import { validateOutput } from "../utils/validateRegister";

@ObjectType()
class CreatePostResponse {
  @Field(() => [validateOutput], { nullable: true})
  errors?: validateOutput[];

  @Field(() => Post, { nullable: true })
  post?: Post
}

@ObjectType()
class PaginatedPostsResponse {
  @Field(() => Boolean)
  hasMore: Boolean;

  @Field(() => [Post], { nullable: true })
  posts?: [Post]
}

@Resolver(__of => Post)
export class PostResolver {
  
  @FieldResolver()
  async creator(@Root() post: Post,
  @Ctx() {userLoader}: MyContext){
    return userLoader.load(post.creatorId)
  }

  @FieldResolver()
  async noteStatus(@Root() post: Post,
  @Ctx() { payload, noteStatusLoader }: MyContext) {
    return noteStatusLoader.load({
      postId : post.id, 
      userId : payload?.userId as any
    })
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async posts() {
    return await Post.find({relations: ['notes', 'creator']})
  }

  @Query(() => PaginatedPostsResponse)
  @UseMiddleware(isAuth)
  async paginatedPosts(
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
  ): Promise<PaginatedPostsResponse> {

    const replacements: any[] = []

    if(cursor) {
      replacements.push(cursor);
    }

    const posts = await getConnection().query(
      `
      select p.*
      from post p
      ${cursor ? `where p."createdAt" < $1` : ""}
      order by p."createdAt" DESC
      limit 11
    `,
      replacements
    );

    return {
      posts: posts.slice(0, 10),
      hasMore: posts.length === 11
    }
  }

  @Mutation(() => CreatePostResponse)
  @UseMiddleware(isAuth)
  async createpost(
    @Arg('title') title: string,
    @Arg('text') text: string,
    @Ctx() Context: MyContext
  ) {
    const errors = validateCreatePost(title,text)
    if(errors){
      return { errors } ;
    }
    const post =  await Post.create({
      title,
      text,
      creatorId:Context.payload?.userId as any,
      noteCount: 0
    }).save()

    return {
      post
    }

  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async note(
    @Arg('postId', () => Int) postId: number,
    @Ctx() Context: MyContext
  ) {

    const userId = Context.payload?.userId
    const updoot = await Note.findOne({where: {postId, userId }})


    // user has voted and is changing the value
    if (updoot ) {
      await getConnection().transaction(async tm => {
        await tm.query(`
          delete from note
          where "postId" = $1 and "userId" = $2
        `,
        [postId, userId]);

        await tm.query(`
          update post
          set "noteCount" = "noteCount" - 1
          where id = $1
          `, [postId]);
      });
    } else if (!updoot) {
      await getConnection().transaction(async tm => {
        await tm.query(`
        insert into note ("userId", "postId")
        values ($1, $2);
        `,[userId, postId]);

        await tm.query(`
          update post
          set "noteCount" = "noteCount" + 1
          where id = $1
          `, [postId]);

      })
    }

    return true;
  }
}