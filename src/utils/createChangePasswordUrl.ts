import { v4 } from 'uuid';
import { redisClient } from '../modules/db/redis';
import { changePasswordPrefix } from '../constants/redisPrefixes';

export const createChangePasswordUrl = async (userId: number) => {
  const token = v4();
  const changePasswordToken = changePasswordPrefix + token;

  redisClient.set(changePasswordToken, userId, 'EX', 60 * 60 * 24); // 1 day expiration

  return `${process.env.FRONT_END_URL}/user/change-password/${token}`;
};
