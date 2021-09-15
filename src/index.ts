import "reflect-metadata";
import { ApolloServer } from 'apollo-server-express';
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createConnection } from "typeorm";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  await createConnection()

  const app = express();

  const schema = await buildSchema({
    resolvers: [HelloResolver, PostResolver]
  });
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start()
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000')
  })
}

main()