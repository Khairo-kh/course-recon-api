import { User } from '../entities/User';
import { MyContext } from 'src/types';
import argon2 from 'argon2';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { UsernamePasswordInput, UserResponse } from './FieldInputAndError';
import { registerValidation } from '../utils/registerValidation';
import { sendEmail } from '../utils/email';
import { v4 } from 'uuid';

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length < 8) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'must at least be 8 characters long',
          },
        ],
      };
    }

    const tokenKey = `reset-pass:${token}`;
    const userId = await redis.get(tokenKey);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }

    const user = await User.findOneBy({ id: parseInt(userId) });
    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'invalid user',
          },
        ],
      };
    }

    User.update(
      { id: parseInt(userId) },
      { password: await argon2.hash(newPassword) }
    );

    redis.del(tokenKey);

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    await redis.set(
      `reset-pass:${token}`,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );

    sendEmail(
      email,
      `<a href="http://localhost:3000/reset-password/${token}">reset password</a>`,
      'password reset request'
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  getMe(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { dataSource }: MyContext
  ): Promise<UserResponse> {
    const errors = registerValidation(options);
    if (errors) {
      return { errors };
    }

    const passwordHash = await argon2.hash(options.password);
    let user;
    try {
      const result = await dataSource
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          password: passwordHash,
          email: options.email,
        })
        .returning('*')
        .execute();
      user = result.raw[0];
    } catch (error: any) {
      if (error.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username is already taken!',
            },
          ],
        };
      }
    }

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOneBy(
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'could not find a match for the provided username',
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'wrong login credentials',
          },
        ],
      };
    }
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie('cid');
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
