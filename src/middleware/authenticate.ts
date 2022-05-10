import { MyContext } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const authenticate: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Must be authenticated to do this action!');
  }

  return next();
};
