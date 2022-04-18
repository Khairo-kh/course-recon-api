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
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import Redis from 'ioredis';
import cors from 'cors';
// import { sendEmail } from './utils/email';
// import { User } from './entities/User';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // orm.em.nativeDelete(User, {})
  await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis('127.0.0.1:6379');

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );
  app.use(
    session({
      name: 'cid',
      store: new RedisStore({
        client: redis,
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
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(8000, () => {
    console.log('server started on localhost:8000');
  });
};

main().catch((e) => {
  console.log(e);
});
