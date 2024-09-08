import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';

import { RegisterResolver } from './modules/user/Register';
import { AppDataSource } from './AppDataSource';

const main = async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    }),
  );

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
