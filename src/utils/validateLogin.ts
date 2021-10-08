import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class validateOutput {
  @Field()
  message: string;
  @Field()
  field: string;
}

export const validateLogin = (username: string, password: string): validateOutput[] | null => {
  //passwords do not match
  if(!password && !username){
    return[
      {
        field: "allFields",
        message: "You do have to fill this stuff out, you know."
      }
    ]
  }

  if(!password){
    return[
      {
        field: "password",
        message: "Password is missing"
      }
    ]
  }
  if(!username){
    return[
      {
        field: "username",
        message: "Username is missing"
      }
    ]
  }
  return null
}
