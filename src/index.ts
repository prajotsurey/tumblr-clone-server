import "reflect-metadata";
import "dotenv/config";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createConnection } from "typeorm";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cookieparser from 'cookie-parser';
import { verify } from "jsonwebtoken";
import { User } from "./entities/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import { Post } from "./entities/Post";

const main = async () => {
  await createConnection()
  Post.delete({})
  const app = express();
  app.use(cookieparser());
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    },)
  )
  app.set("proxy", 1);
  app.post("/refresh_token", async (req,res) => {
    const token = req.cookies.jid
    if(!token) {
      return res.send({ ok: false, accessToken: '' })
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch(err) {
      return res.send({ ok: false, accessToken: '' })
    }

    const user = await User.findOne({id: payload.userId})

    if(!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if(user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  })


  const schema = await buildSchema({
    resolvers: [HelloResolver, PostResolver, UserResolver]
  });
  const apolloServer = new ApolloServer({ 
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({req, res}) => ({ req, res })
   });

  await apolloServer.start()
  apolloServer.applyMiddleware({ 
    app,
    cors: false
   });

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main()