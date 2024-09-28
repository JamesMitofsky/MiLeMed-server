import { v4 } from 'uuid';
import { redisClient } from '../db/redis';
import { confirmUserPrefix } from '../constants/redisPrefixes';

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  const confirmAccountToken = confirmUserPrefix + token;

  redisClient.set(confirmAccountToken, userId, 'EX', 60 * 60 * 24); // 1 day expiration

  return `${process.env.FRONT_END_URL}/user/confirm/${token}`;
};
