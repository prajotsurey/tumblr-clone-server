import { Post } from "../entities/Post";
import { Resolver,Mutation, Arg, Query, UseMiddleware, Ctx, Field, ObjectType } from "type-graphql";
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

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async posts() {
    return await Post.find()
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
      creatorId:Context.payload?.userId as any
    }).save()

    return {
      post
    }

  }
}