import { Rating } from '../entities/Rating';
import { MyContext } from 'src/types';
import { Arg, Ctx, Float, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class RatingResolver {
  @Query(() => [Rating])
  ratings(@Ctx() { em }: MyContext): Promise<Rating[]> {
    return em.find(Rating, {});
  }

  @Query(() => Rating, { nullable: true })
  rating(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Rating | null> {
    return em.findOne(Rating, { id });
  }

  @Mutation(() => Rating, { nullable: true })
  async addRating(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number,
    @Ctx() { em }: MyContext
  ): Promise<Rating> {
    const rating = em.create(Rating, { title, description, scale });
    await em.persistAndFlush(rating);
    return rating;
  }

  @Mutation(() => Rating, { nullable: true })
  async updateRating(
    @Arg('id') id: number,
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number,
    @Ctx() { em }: MyContext
  ): Promise<Rating | null> {
    const rating = await em.findOne(Rating, { id });
    if (!rating) {
      return null;
    }
    if (
      typeof title !== 'undefined' ||
      typeof description !== 'undefined' ||
      typeof scale !== 'undefined'
    ) {
      rating.title = title;
      rating.description = description;
      rating.scale = scale;
      await em.persistAndFlush(rating);
    }
    return rating;
  }

  @Mutation(() => Boolean)
  async deleteRating(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    try {
      await em.nativeDelete(Rating, { id });
    } catch (error) {
      return false;
    }

    return true;
  }
}
