import axios from 'axios';
import { CourseInfo } from '../types';

export const getCourseInfo = async (
  subject: string,
  catalog: string
): Promise<CourseInfo[] | null> => {
  let course = new Array<CourseInfo>();
  const courseInfoEndpoint = `/course/catalog/filter/${subject}/${catalog}/*`;

  try {
    const response = await axios.get(
      process.env.CONCORDIA_API_BASE_URL + courseInfoEndpoint,
      {
        auth: {
          username: process.env.CONCORDIA_API_USERNAME,
          password: process.env.CONCORDIA_API_KEY,
        },
      }
    );
    course = response.data;
  } catch (error) {
    console.log('error fetching the course from Concordia API: ', error);
    return null;
  }

  return course;
};

export const getCourseDescription = async (
  courseId: string
): Promise<string> => {
  const courseDescriptionEndpoint = `/course/description/filter/${courseId}`;
  let description = '';
  try {
    const response = await axios.get(
      process.env.CONCORDIA_API_BASE_URL + courseDescriptionEndpoint,
      {
        auth: {
          username: process.env.CONCORDIA_API_USERNAME,
          password: process.env.CONCORDIA_API_KEY,
        },
      }
    );
    description = response.data[0].description;
  } catch (error) {
    console.log(
      'error fetching the course description from Concordia API: ',
      error
    );
    return '';
  }

  return description;
};

export const getConcordiaCourse = async (
  subject: string,
  catalog: string
): Promise<CourseInfo | null> => {
  const courseInfo = await getCourseInfo(subject, catalog);
  if (!courseInfo || courseInfo.length === 0) {
    return null;
  }

  courseInfo[0].description = await getCourseDescription(courseInfo[0].ID);

  return courseInfo[0];
};
