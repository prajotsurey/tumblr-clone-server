import { Post } from "../entities/Post";
import { Resolver,Mutation, Arg, Query } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return await Post.find()
  }

  @Mutation(() => Post)
  async createpost(
    @Arg('title') title: string,
    @Arg('text') text: string
  ) {

    return await Post.create({
      title,
      text
    }).save()

  }
}