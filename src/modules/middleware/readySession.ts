import RedisStore from 'connect-redis';
import session from 'express-session';
import { redisClient } from '../../db/redis';
import { nodeEnv } from '../environmentVariables';

const redisStore = new RedisStore({
  client: redisClient,
});

export const readySession = session({
  store: redisStore,
  name: 'qid',
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // this prevents client side JS from reading the cookie
    secure: nodeEnv === 'development' ? false : true, // this forces the cookie to only be sent over https in production
    sameSite: 'none', // process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Lax for local, None for cross-origin requests
    maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
  },
});
