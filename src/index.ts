import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { __prod__ } from './constants';
import { Course } from './entities/Course';
import { Rating } from './entities/Rating';
import { User } from './entities/User';
import { CourseResolver } from './resolvers/course';
import { HelloResolver } from './resolvers/hello';
import { RatingResolver } from './resolvers/rating';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';

const main = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    // synchronize: true,
    logging: 'all',
    logger: 'advanced-console',
    entities: [Rating, User, Course],
  });

  dataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set('proxy', 1);

  app.use(
    cors({
      origin: process.env.ORIGIN_CORS,
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
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, RatingResolver, UserResolver, CourseResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ dataSource, req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
};

main().catch((e) => {
  console.log(e);
});
