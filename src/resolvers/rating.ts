import {
  Arg,
  Ctx,
  Float,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Rating } from '../entities/Rating';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { MyContext } from '../types';

@Resolver()
export class RatingResolver {
  @Query(() => [Rating])
  async ratings(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('courseNum', () => Int, { nullable: true }) courseNum: number | null,
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
    if (courseNum) {
      result.andWhere('"courseId" = :courseNum', {
        courseNum,
      });
    }
    return result.getMany();
  }

  @Query(() => Rating, { nullable: true })
  rating(@Arg('id') id: number): Promise<Rating | null> {
    return Rating.findOneBy({ id });
  }

  @Mutation(() => Rating, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async addRating(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number,
    @Arg('courseId', () => Int) courseId: number,
    @Ctx() { req }: MyContext
  ): Promise<Rating> {
    return Rating.create({
      title,
      description,
      scale,
      courseId,
      reviewerId: req.session.userId,
    }).save();
  }

  @Mutation(() => Rating, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async updateRating(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number,
    @Ctx() { req, dataSource }: MyContext
  ): Promise<Rating | null> {
    const rating = await dataSource
      .createQueryBuilder()
      .update(Rating)
      .set({ title, description, scale })
      .where('id = :id', { id })
      .andWhere('"reviewerId" = :revId', { revId: req.session.userId })
      .returning('*')
      .execute();

    return rating.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteRating(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const answer = await Rating.delete({ id, reviewerId: req.session.userId });
    return answer.affected !== 0;
  }
}
