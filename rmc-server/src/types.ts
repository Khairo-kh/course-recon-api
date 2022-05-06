import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';
// TODO: Check if I'm using declaration merging correctly here
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Request;
  res: Response;
  redis: Redis;
};
