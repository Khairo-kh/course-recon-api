import { User } from '../entities/User';
import { MyContext } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const userId = context.req.session.userId;
  const user = await User.findOneBy({ id: userId });
  if (user?.role !== 'admin') {
    throw new Error('You are not authorized to perform this action!');
  }

  return next();
};
