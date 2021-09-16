import { Field, ObjectType } from "type-graphql";
import { registerUserInput } from "./types";

@ObjectType()
export class validateOutput {
  @Field()
  message: string;
  @Field()
  field: string;
}

export const validateRegister = (options: registerUserInput): validateOutput[] | null => {
  //passwords do not match
  if(options.password !== options.passwordConfirm){
    return[
      {
        field: "password",
        message: "passwords do not match"
      },
      {
        field: "passwordConfirm",
        message: "passwords do not match"
      }
    ]
  }
  //passwords aren't long enough
  if(options.password.length <8){
    return[
      {
        field: "password",
        message: "must be longer than 8"
      }
    ]
  }
  //username isn't long enough
  if(options.username.length <3){
    return[
      {
        field: "username",
        message: "must be longer than 3"
      }
    ]
  }
  return null
}
