import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import {MyContext } from '../types';
import { authenticate } from '../middleware/authenticate';
import { Course } from '../entities/Course';
import { getCourseDescription, getCourseInfo } from '../utils/courseFetch';

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  async courses(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { dataSource }: MyContext
  ): Promise<Course[]> {
    const realLimit = Math.min(30, limit);
    const result = await dataSource
      .getRepository(Course)
      .createQueryBuilder('c')
      .orderBy('"externalId"', 'DESC')
      .take(realLimit);

    if (cursor) {
      result.where('"externalId" >= :cursor', {
        cursor,
      });
    }
    return result.getMany();
  }

  @Query(() => Course, { nullable: true })
  course(@Arg('id') id: number): Promise<Course | null> {
    return Course.findOneBy({ id });
  }

  @Mutation(() => Course, { nullable: true })
  @UseMiddleware(authenticate)
  async addCourse(
    @Arg('subject') subject: string,
    @Arg('catalog') catalog: string
    // @Ctx() { req }: MyContext
  ): Promise<Course | undefined> {
    const courseInfo = await getCourseInfo(subject, catalog);
    if (!courseInfo || courseInfo.length === 0) {
      return;
    }

    courseInfo[0].description = await getCourseDescription(courseInfo[0].ID);

    console.log('DESC: => ', courseInfo);

    return Course.create({
      externalId: courseInfo[0].ID,
      title: courseInfo[0].title,
      subject: courseInfo[0].subject,
      catalog: courseInfo[0].catalog,
      prerequisites: courseInfo[0].prerequisites,
      description: courseInfo[0].description,
    }).save();
  }

  // @Mutation(() => Rating, { nullable: true })
  // async updateRating(
  //   @Arg('id', () => Int) id: number,
  //   @Arg('title') title: string,
  //   @Arg('description') description: string,
  //   @Arg('scale', () => Float) scale: number
  // ): Promise<Rating | null> {
  //   const rating = await Rating.findOneBy({ id });
  //   if (!rating) {
  //     return null;
  //   }
  //   if (
  //     typeof title !== 'undefined' ||
  //     typeof description !== 'undefined' ||
  //     typeof scale !== 'undefined'
  //   ) {
  //     await Rating.update({ id }, { title, description, scale });
  //   }
  //   return rating;
  // }

  // @Mutation(() => Boolean)
  // async deleteRating(@Arg('id', () => Int) id: number): Promise<Boolean> {
  //   await Rating.delete(id);
  //   return true;
  // }
}
