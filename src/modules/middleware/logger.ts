import { MiddlewareFn } from 'type-graphql';

import { MyContext } from '../../types/MyContext';

export const logger: MiddlewareFn<MyContext> = async (args, next) => {
  //   console.log('main args: ', args);
  console.log('session: ', args.context.req.session);

  return next();
};
