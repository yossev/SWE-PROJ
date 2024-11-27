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
    return this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();
  }
}