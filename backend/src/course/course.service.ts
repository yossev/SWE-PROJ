/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';
import { Course, CourseDocument } from '../models/course-schema'; // Import NotificationService
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    private readonly notificationService: NotificationService // Inject NotificationService
  ) {}

  // Create a new course and notify the user
  async create(createCourseDto: CreateCourseDto): Promise<CourseDocument> {
    try {
      const createdCourse = new this.courseModel(createCourseDto);
      const savedCourse = await createdCourse.save();
  
      // Notify the course creator
      const userId = createCourseDto.created_by; // Use the `created_by` property as userId
      const courseName = createCourseDto.title; // Use the `title` property as the course name
  
      await this.notificationService.notifyCourseCreation(
        userId, // Creator of the course
        savedCourse._id.toString(), // Saved course ID
        courseName // Course title
      );
  
      return savedCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course');
    }
  }
  

  // Find all courses
  async findAll(): Promise<CourseDocument[]> {
    return this.courseModel.find().exec();
  }

  // Find a course by ID
  async findOne(id: string): Promise<CourseDocument> {
    return this.courseModel.findById(id).exec();
  }

  // Update an existing course
  async update(
    id: string,
    updateCourseDto: UpdateCourseDto
  ): Promise<CourseDocument | null> {
    const course = await this.courseModel.findById(id).exec();
    if (course) {
      course.versions.push(JSON.stringify(course)); // Track changes
      Object.assign(course, updateCourseDto); // Apply updates
      return course.save();
    }
    return null;
  }

  // Search for courses based on a search term
  async search(searchTerm: string): Promise<CourseDocument[]> {
    return this.courseModel
      .find({
        $text: { $search: searchTerm }, // Use full-text search
      })
      .exec();
  }

  // Delete a course by ID
  async delete(id: string): Promise<CourseDocument | null> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }
}

