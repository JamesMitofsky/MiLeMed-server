import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { ChangePasswordInput } from './inputs/ChangePasswordInput';
import { redisClient } from '../db/redis';
import { changePasswordPrefix } from '../../constants/redisPrefixes';

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data')
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    const userId = await redisClient.get(changePasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOneBy({ id: parseInt(userId) });

    if (!user) {
      return null;
    }

    await redisClient.del(changePasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    ctx.req.session!.connectedUser = user;

    return user;
  }
}
