import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { Course } from '../entities/Course';
import { isAdmin } from '../middleware/isAdmin';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { MyContext } from '../types';
import { getConcordiaCourse } from '../utils/courseFetch';

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

  @Query(() => Course, { nullable: true })
  async findCourse(
    @Arg('subject') subject: string,
    @Arg('catalog') catalog: string
  ): Promise<Course | null> {
    let searchedCourse = await Course.findOneBy({
      subject: subject.toUpperCase(),
      catalog,
    });
    if (!searchedCourse) {
      searchedCourse = await this.addCourse(subject, catalog);
    }
    return searchedCourse;
  }

  @Mutation(() => Course, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async addCourse(
    @Arg('subject') subject: string,
    @Arg('catalog') catalog: string
  ): Promise<Course | null> {
    const courseInfo = await getConcordiaCourse(subject, catalog);

    if (!courseInfo) {
      return null;
    }

    return Course.create({
      externalId: courseInfo.ID,
      title: courseInfo.title,
      subject: courseInfo.subject,
      catalog: courseInfo.catalog,
      prerequisites: courseInfo.prerequisites,
      description: courseInfo.description,
    }).save();
  }

  @Mutation(() => Course, { nullable: true })
  async updateCourse(
    @Arg('subject') subject: string,
    @Arg('catalog') catalog: string,
    @Ctx() { dataSource }: MyContext
  ): Promise<Course | null> {
    const currentDetails = await Course.findOneBy({ subject, catalog });
    const updatedDetails = await getConcordiaCourse(subject, catalog);
    if (!currentDetails || !updatedDetails) {
      return null;
    }

    const updatedCourse = await dataSource
      .createQueryBuilder()
      .update(Course)
      .set({
        externalId: updatedDetails.ID,
        title: updatedDetails.title,
        subject: updatedDetails.subject,
        catalog: updatedDetails.catalog,
        prerequisites: updatedDetails.prerequisites,
        description: updatedDetails.description,
      })
      .where('id = :courseId', { courseId: currentDetails.id })
      .returning('*')
      .execute();

    return updatedCourse.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated, isAdmin)
  async deleteCourse(@Arg('id', () => Int) id: number): Promise<Boolean> {
    await Course.delete(id);
    return true;
  }
}
