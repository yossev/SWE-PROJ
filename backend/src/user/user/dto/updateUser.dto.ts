import {  Course,CourseSchema } from "models/course-schema";

export default class updateUserDto {
    name?: string;
    age?: Number;
    courses?: Course[];
  }

