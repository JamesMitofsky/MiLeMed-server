import { MyContext } from 'src/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

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
