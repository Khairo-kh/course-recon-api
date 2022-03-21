import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import session from 'express-session';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { RatingResolver } from './resolvers/rating';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'sid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                secure: __prod__,
                sameSite: 'lax',
            },
            // TODO: Change this and store in env variable
            secret: 'Deem-Dayroom-Appraiser-Velcro-Varsity-Lily-Icky-Tackling',
            resave: false,
            saveUninitialized: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, RatingResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(8000, () => {
        console.log('server started on localhost:8000');
    });
};

main().catch((e) => {
    console.log(e);
});
