import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { sendChangePasswordEmail } from '../../utils/sendChangePasswordEmail';

@Resolver()
export class RequestChangePasswordResolver {
  @Mutation(() => Boolean)
  async requestChangePassword(@Arg('email') email: string): Promise<boolean> {
    const user = await User.findOneBy({ email });

    if (!user) {
      return false;
    }

    await sendChangePasswordEmail(user);
    return true;
  }
}
