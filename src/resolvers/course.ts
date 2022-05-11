import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { MyContext } from '../types';
import { authenticate } from '../middleware/authenticate';
import { Course } from '../entities/Course';
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
  @UseMiddleware(authenticate)
  async addCourse(
    @Arg('subject') subject: string,
    @Arg('catalog') catalog: string
  ): Promise<Course | null> {
    const courseInfo = await getConcordiaCourse(subject, catalog);

    if (!courseInfo) {
      return null;
    }

    console.log({ courseInfo });

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
    @Arg('catalog') catalog: string
  ): Promise<Course | null> {
    const currentDetails = await Course.findOneBy({ subject, catalog });
    const updatedDetails = await getConcordiaCourse(subject, catalog);
    console.log({ currentDetails });
    if (!currentDetails || !updatedDetails) {
      return null;
    }

    await Course.update(
      { id: currentDetails.id },
      {
        externalId: updatedDetails.ID,
        title: updatedDetails.title,
        subject: updatedDetails.subject,
        catalog: updatedDetails.catalog,
        prerequisites: updatedDetails.prerequisites,
        description: updatedDetails.description,
      }
    );

    return currentDetails;
  }

  @Mutation(() => Boolean)
  async deleteCourse(@Arg('id', () => Int) id: number): Promise<Boolean> {
    await Course.delete(id);
    return true;
  }
}
