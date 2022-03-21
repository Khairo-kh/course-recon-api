import { User } from '../entities/User';
import { MyContext } from 'src/types';
import argon2 from 'argon2';
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Resolver,
} from 'type-graphql';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

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
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username must be at least 3 characters',
                    },
                ],
            };
        }

        if (options.password.length < 8) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password must at least be 8 characters',
                    },
                ],
            };
        }

        const passwordHash = await argon2.hash(options.password);
        const user = em.create(User, {
            username: options.username,
            password: passwordHash,
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
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message:
                            'could not find a match for the provided username',
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
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
}
