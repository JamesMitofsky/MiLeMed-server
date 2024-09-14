import { v4 } from 'uuid';
import { redisClient } from '../modules/db/redis';

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  redisClient.set(token, userId, 'EX', 60 * 60 * 24); // 1 day expiration

  return `${process.env.FRONT_END_URL}/user/confirm/${token}`;
};
