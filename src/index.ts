import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { RegisterResolver } from './modules/user/Register';
import { AppDataSource } from './modules/db/AppDataSource';
import express from 'express';
import { LoginResolver } from './modules/user/Login';
import { MyContext } from './types/MyContext';
import { MeResolver } from './modules/user/Me';
import { TestResolver } from './modules/Test';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { readySession } from './modules/middleware/readySession';

const main = async () => {
  // TypeORM Initialization
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, TestResolver],
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
