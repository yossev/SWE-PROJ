import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../../models/course-schema';
import { CreateCourseDto } from './dto/createCourse.dto'; 
import { UpdateCourseDto } from './dto/updateCourse.dto'; 

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async create(createCourseDto: CreateCourseDto) { // Use CreateCourseDto
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAll() {
    return this.courseModel.find().exec();
  }

  async findOne(id: string) {
    return this.courseModel.findById(id).exec();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) { // Use UpdateCourseDto
    const course = await this.courseModel.findById(id).exec()
    if (course) {
        course.versions.push(JSON.stringify(course))
        Object.assign(course, UpdateCourseDto) // Update Course
        return course.save()
    }
    return null;
  }

  // note: might add debounce function ( Limit Calls while searching )
  async search(searchTerm: string) {
    return this.courseModel.find({
      $text: {$search: searchTerm} // Search on the indexed texts
    }).exec()
  }

  async delete(id: string) {
    const result =  await this.courseModel.findByIdAndDelete(id).exec();
    return result;
  }

}
