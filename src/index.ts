import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Rating } from './entities/Rating';
import microConfig from './mikro-orm.config';
const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    // const rating = orm.em.create(Rating, {
    //     title: 'moon',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     id: 123,
    // });
    // await orm.em.persistAndFlush(rating);

    // const ratings = await orm.em.find(Rating, {});
    // console.log(ratings);
};

main().catch((e) => {
    console.log(e);
});
