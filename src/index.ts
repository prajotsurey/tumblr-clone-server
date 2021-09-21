import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createConnection } from "typeorm";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
  await createConnection()

  const app = express();

  app.set("proxy", 1);
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    },)
  )

  const schema = await buildSchema({
    resolvers: [HelloResolver, PostResolver, UserResolver]
  });
  const apolloServer = new ApolloServer({ 
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
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