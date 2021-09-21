import { Field, InputType } from "type-graphql";
import { Request, Response } from "express";

@InputType()
export class registerUserInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  passwordConfirm!: string
}

export type MyContext = {
  req: Request;
  res: Response;
  payload?: { userId: string };
};


