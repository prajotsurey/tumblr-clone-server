import argon2 from 'argon2';
import { verify } from 'jsonwebtoken';
import { validateLogin } from '../utils/validateLogin';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from 'typeorm';
import { createAccessToken, createRefreshToken } from '../auth';
import { User } from "../entities/User";
import { isAuth } from '../isAuth';
import { MyContext, registerUserInput } from '../utils/types';
import { validateOutput, validateRegister } from '../utils/validateRegister';
import { sendRefreshToken } from '../sendRefreshToken';

@ObjectType()
class UserResponse {
  @Field(() => [validateOutput], { nullable: true})
  errors?: validateOutput[];

  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => String, {nullable: true})
  token?: string
}


@Resolver()
export class UserResolver{

  @Query(() => User, { nullable: true})
  async Me(
    @Ctx() { req }: MyContext){
    const authorization = req.headers['authorization'];

    if(!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload:any = verify(token, process.env.ACCESS_TOKEN_SECRET!)
      const user = User.findOne({ id: payload.userId })
      if(user){
        return user
      }
    } catch(err) {
      console.log(err)
      return null;
    }
    return 'me'
  }
  
  @Query(() => User, { nullable: true})
  async user(
    @Arg('id') id: number){
  return await User.findOne(id, {relations: ['posts']})
  } 

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() {payload}: MyContext
  ) {
    return `your userId is ${payload!.userId}`;
  }

  @Mutation(() => UserResponse)
  async register(
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

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId', () => Int) userId: number
  ) {
    await getConnection()
    .getRepository(User)
    .increment({ id: userId },"tokenVersion", 1);
    
    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string,
    @Ctx() {res}: MyContext
  ):Promise<UserResponse>{
    const errors = validateLogin(username, password)
    if(errors){
      return { errors } ;
    }
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
      if(!valid){
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

      // sendRefreshToken(res,createRefreshToken(user))
      res.cookie("jid", createRefreshToken(user), {
        httpOnly: true
      })
      return {
        user: user,
        token: createAccessToken(user)
      }

    } catch(e){
      return {};
    }
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() {res}:MyContext){
    sendRefreshToken(res,'')
    return true;
  }
}