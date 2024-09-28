import { Resolver, Mutation, Arg } from 'type-graphql';
import { redisClient } from '../../db/redis';
import { User } from '../../entity/User';
import { confirmUserPrefix } from '../../constants/redisPrefixes';

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean, { nullable: true })
  async confirmUser(@Arg('token') token: string): Promise<boolean> {
    try {
      const confirmUserToken = confirmUserPrefix + token;
      const userId = await redisClient.get(confirmUserToken);

      if (!userId) {
        return false;
      }

      await User.update(userId, { confirmed: true });
      await redisClient.del(confirmUserToken);

      return true;
    } catch (error) {
      console.error('Error confirming user:', error);
      return false;
    }
  }
}
