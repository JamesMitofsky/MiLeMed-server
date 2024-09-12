import Redis from 'ioredis';
import { MyContext } from 'src/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

// Redis Client
export const redisClient = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379',
);
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  console.log(context.req.session);
  if (!context.req.session!.connectedUser) {
    throw new Error('Not authenticated');
  }

  console.log(
    'A protected query is being accessed by this user:',
    context.req.session!.connectedUser,
  );

  return next();
};
