import { Resolver, Query, UseMiddleware } from 'type-graphql';

import { isAuth } from './middleware/isAuth';

@Resolver()
export class TestResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async test() {
    return 'Hello World! — this query requires auth';
  }
}
