import { Rating } from '../entities/Rating';
import { MyContext } from 'src/types';
import { Ctx, Query, Resolver } from 'type-graphql';

@Resolver()
export class RatingResolver {
    @Query(() => [Rating])
    ratings(@Ctx() { em }: MyContext): Promise<Rating[]> {
        return em.find(Rating, {});
    }
}
