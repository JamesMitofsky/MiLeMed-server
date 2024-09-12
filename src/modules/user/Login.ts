import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import bcrypt from 'bcryptjs';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User | null> {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // User not found
      return null;
    }

    // Check if the password is correct
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      // Invalid password
      return null;
    }

    // send the user a cookie saying they're authenticated
    console.log('Before setting user:', ctx.req.session);
    ctx.req.session!.connectedUser = { id: user.id, name: user.name };
    console.log('After setting user:', ctx.req.session);

    ctx.req.session!.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
    });

    // Return the user if authentication is successful
    return user;
  }
}
