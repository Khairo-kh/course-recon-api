import { User } from '../entities/User';
import { MyContext } from 'src/types';
import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { registerValidation } from '../utils/registerValidation';
import { sendEmail } from '../utils/email';
import { v4 } from 'uuid';

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });
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
  async getMe(@Ctx() { req, em }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const me = await em.findOne(User, { id: req.session.userId });
    return me;
  }
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const errors = registerValidation(options);
    if (errors) {
      return { errors };
    }

    const passwordHash = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: passwordHash,
      email: options.email,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
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
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
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
    console.log('req.session ', req.session);
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
