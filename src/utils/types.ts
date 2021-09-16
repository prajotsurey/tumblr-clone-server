import { Field, InputType } from "type-graphql";

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
