import { Post } from "../entities/Post";
import { Resolver,Mutation, Arg, Query, UseMiddleware, Ctx, Field, ObjectType, FieldResolver, Root, Int } from "type-graphql";
import { isAuth } from "../isAuth";
import { MyContext } from "../utils/types";
import { validateCreatePost } from "../utils/validateCreatePost";
import { validateOutput } from "../utils/validateRegister";
import { User } from "../entities/User";
import { Note } from "../entities/Note";
import { getConnection } from "typeorm";

@ObjectType()
class CreatePostResponse {
  @Field(() => [validateOutput], { nullable: true})
  errors?: validateOutput[];

  @Field(() => Post, { nullable: true })
  post?: Post
}

@Resolver(of => Post)
export class PostResolver {
  
  @FieldResolver()
  async creator(@Root() post: Post){
    const user =  await User.find({ id: post.creatorId })
    console.log(user)
    return user[0]
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async posts() {
    return await Post.find({relations: ['notes', 'creator']})
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
    console.log(Context.payload)
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