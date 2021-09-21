import argon2 from 'argon2';
import { Arg, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { registerUserInput } from '../utils/types';
import { validateOutput, validateRegister } from '../utils/validateRegister';

@ObjectType()
class UserResponse {
  @Field(() => [validateOutput], { nullable: true})
  errors?: validateOutput[];

  @Field(() => User, { nullable: true })
  user?: User
}


@Resolver()
export class UserResolver{
  @Query(() => User, { nullable: true})
  async user(
    @Arg('id') id: string){
  return await User.findOne(id)
  } 

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('options') options: registerUserInput
  ): Promise<UserResponse>{
    const errors = validateRegister(options)
    if(errors){
      return { errors } ;
    }
    try{
      const hashedPassword = await argon2.hash(options.password)
      const user = await User.create({
        username: options.username,
        email : options.email,
        password: hashedPassword
      }).save()
      return { user }
    } catch(e){
      if(e.detail.includes('already exists')){
        console.log(e.detail)
        return {
          errors:[{
            field: 'username',
            message: 'username already exists'
          }]
        }
      }
      return {}
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
  ):Promise<UserResponse>{
    try{
      const user = await User.findOne({ where: {username: username}})
      if(!user){
        return {
          errors:[
            {
              field: 'username',
              message: 'incorrect username or password'
            },
            {
              field: 'password',
              message: 'incorrect username or password'
            }
          ]
        }
      }
      const valid = await argon2.verify(user.password, password)
      if(valid){
        return {
          user: user
        }
      }
      return {
        errors:[
          {
            field: 'username',
            message: 'incorrect username or password'
          },
          {
            field: 'password',
            message: 'incorrect username or password'
          }
        ]
      }
    } catch(e){
      return {};
    }
  }


}