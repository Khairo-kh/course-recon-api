import { Rating } from '../entities/Rating';
import {
  Arg,
  Ctx,
  Float,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { MyContext } from 'src/types';
import { authenticate } from '../middleware/authenticate';

@Resolver()
export class RatingResolver {
  @Query(() => [Rating])
  async ratings(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { dataSource }: MyContext
  ): Promise<Rating[]> {
    const realLimit = Math.min(30, limit);
    const result = await dataSource
      .getRepository(Rating)
      .createQueryBuilder('r')
      .orderBy('"createdAt"', 'DESC')
      .take(realLimit);

    if (cursor) {
      result.where('"createdAt" >= :cursor', {
        cursor: new Date(cursor),
      });
    }
    return result.getMany();
  }

  @Query(() => Rating, { nullable: true })
  rating(@Arg('id') id: number): Promise<Rating | null> {
    return Rating.findOneBy({ id });
  }

  @Mutation(() => Rating, { nullable: true })
  @UseMiddleware(authenticate)
  async addRating(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number,
    @Ctx() { req }: MyContext
  ): Promise<Rating> {
    return Rating.create({
      title,
      description,
      scale,
      reviewerId: req.session.userId,
    }).save();
  }

  @Mutation(() => Rating, { nullable: true })
  async updateRating(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number
  ): Promise<Rating | null> {
    const rating = await Rating.findOneBy({ id });
    if (!rating) {
      return null;
    }
    if (
      typeof title !== 'undefined' ||
      typeof description !== 'undefined' ||
      typeof scale !== 'undefined'
    ) {
      await Rating.update({ id }, { title, description, scale });
    }
    return rating;
  }

  @Mutation(() => Boolean)
  async deleteRating(@Arg('id', () => Int) id: number): Promise<Boolean> {
    await Rating.delete(id);
    return true;
  }
}
