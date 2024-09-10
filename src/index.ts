import 'reflect-metadata';
// import { ApolloServer } from 'apollo-server-express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { RegisterResolver } from './modules/user/Register';
import { AppDataSource } from './AppDataSource';
import RedisStore from 'connect-redis';
import session from 'express-session';
import express from 'express';
import { Redis } from 'ioredis';
import { LoginResolver } from './modules/Login';
import { MyContext } from './types/MyContext';

const main = async () => {
  // TypeORM Initialization
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver],
  });

  // Apollo Server
  const apolloServer = new ApolloServer<MyContext>({
    schema,
  });
  await apolloServer.start();

  // Express Server
  const app = Express();

  // Redis Client
  const redisClient = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379',
  );
  redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
  });
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  // Cors Middleware
  app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
    }),
  );

  // Add session middleware
  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
      }),
      name: 'qid',
      secret: process.env.SESSION_SECRET || 'fallback_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    }),
  );

  // Apollo Server Middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    }),
  );

  app.listen(4000, () => {
    console.log('server started on http://localhost:4000/graphql');
  });
};

main();
