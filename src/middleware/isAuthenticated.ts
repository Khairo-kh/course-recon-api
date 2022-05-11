import { MyContext } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('Must be authenticated to do this action!');
  }

  return next();
};
