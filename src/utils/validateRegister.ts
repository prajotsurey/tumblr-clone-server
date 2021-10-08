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
  if(!options.password && !options.passwordConfirm && !options.email && !options.username){
    return[
      {
        field: "allFields",
        message: "You do have to fill this stuff out, you know."
      }
    ]
  }
  if(options.password !== options.passwordConfirm){
    return[
      {
        field: "password",
        message: "Passwords do not match"
      },
      {
        field: "passwordConfirm",
        message: "Passwords do not match"
      }
    ]
  }
  if(options.password.length <1){
    return[
      {
        field: "password",
        message: "Password is missing"
      }
    ]
  } else if(options.password.length <8){
    return[
      {
        field: "password",
        message: "Password must be longer than 8 characters"
      }
    ]
  }
  if(options.username.length <1){
    return[
      {
        field: "username",
        message: "Username is missing"
      }
    ]
  } else if(options.username.length <3){
    return[
      {
        field: "username",
        message: "Username must be longer than 3"
      }
    ]
  }
  return null
}
