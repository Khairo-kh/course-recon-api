import { Rating } from '../entities/Rating';
import { Arg, Float, Int, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class RatingResolver {
  @Query(() => [Rating])
  ratings(): Promise<Rating[]> {
    return Rating.find();
  }

  @Query(() => Rating, { nullable: true })
  rating(@Arg('id') id: number): Promise<Rating | null> {
    return Rating.findOneBy({ id });
  }

  @Mutation(() => Rating, { nullable: true })
  async addRating(
    @Arg('title') title: string,
    @Arg('description') description: string,
    @Arg('scale', () => Float) scale: number
  ): Promise<Rating> {
    return Rating.create({ title, description, scale }).save();
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
