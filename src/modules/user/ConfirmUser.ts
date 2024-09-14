import { Resolver, Mutation, Arg } from 'type-graphql';
import { redisClient } from '../db/redis';
import { User } from '../../entity/User';

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    try {
      const userId = await redisClient.get(token);

      if (!userId) {
        return false;
      }

      await User.update(userId, { confirmed: true });
      await redisClient.del(token);

      return true;
    } catch (error) {
      console.error('Error confirming user:', error);
      return false;
    }
  }
}
