import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { AppDataSource } from './db/AppDataSource';
import express from 'express';
import { MyContext } from './types/MyContext';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { readySession } from './modules/middleware/readySession';
import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';
import { TestResolver } from './modules/Test';
import { ConfirmUserResolver } from './modules/user/ConfirmUser';
import { RequestChangePasswordResolver } from './modules/user/RequestChangePassword';
import { ChangePasswordResolver } from './modules/user/ChangePassword';
import { LogoutResolver } from './modules/user/Logout';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { UploadImageResolver } from './modules/image/UploadImage';
import { FetchImageResolver } from './modules/image/FetchImage';

const main = async () => {
  // TypeORM Initialization
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      TestResolver,
      ConfirmUserResolver,
      RequestChangePasswordResolver,
      ChangePasswordResolver,
      LogoutResolver,
      UploadImageResolver,
      FetchImageResolver,
    ],
  });

  // Apollo Server
  const apolloServer = new ApolloServer<MyContext>({
    schema,
    status400ForVariableCoercionErrors: true,
  });
  await apolloServer.start();

  // Express Server
  const app = express();

  app.use(readySession);

  // Apollo Server Middleware
  app.use(
    '/graphql',
    cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    }),
    express.json(),
    graphqlUploadExpress(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );

  // Create an HTTP server to attach both HTTP and WebSocket servers
  const httpServer = createServer(app);

  // Set up WebSocket server for GraphQL subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Use GraphQL WebSocket server
  useServer({ schema }, wsServer);

  // Start the HTTP server and listen for requests
  httpServer.listen(4000, () => {
    console.log('Server is now running on http://localhost:4000/graphql');
  });
};

main();
