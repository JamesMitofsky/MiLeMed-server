import 'reflect-metadata';
// import { ApolloServer } from 'apollo-server-express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { RegisterResolver } from './modules/user/Register';
import { AppDataSource } from './AppDataSource';
import RedisStore from 'connect-redis';
import session from 'express-session';
import express from 'express';
import { LoginResolver } from './modules/user/Login';
import { MyContext } from './types/MyContext';
import { MeResolver } from './modules/user/Me';
import { TestResolver } from './modules/Test';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { redisClient } from './redis';

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

  // Add session middleware
  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      store: redisStore,
      name: 'qid',
      secret: process.env.SESSION_SECRET || 'fallback_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true, // in prod this should be true
        secure: false, // process.env.NODE_ENV === 'production',
        sameSite: 'none', // process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Lax for local, None for cross-origin requests
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    }),
  );

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
