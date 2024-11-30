import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { Quiz, QuizDocument } from '../../models/quizzes-schema';
import { CreateProgressDTO } from './dto/createProgress.dto';
import { UpdateProgressDTO } from './dto/updateProgress.dto';
import { Responses } from '../../models/responses-schema';
import { Course, CourseDocument } from '../../models/course-schema';
import mongoose from 'mongoose';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Response.name) private responseModel: Model<Responses>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,

  ) { }

  async create(createProgressDto: CreateProgressDTO): Promise<Progress> {
    const newProgress = new this.progressModel(createProgressDto);
    return newProgress.save();
  }

  async findAll(): Promise<Progress[]> {
    return this.progressModel.find().exec();
  }

  async findOne(id: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ _id: id }).exec();
    if (!progress) {
      throw new NotFoundException(`Progress record with ID ${id} not found`);
    }
    return progress;
  }

  async update(id: string, updateProgressDto: UpdateProgressDTO): Promise<Progress> {
    const updatedProgress = await this.progressModel
      .findByIdAndUpdate(id, updateProgressDto, { new: true }).exec();
    if (!updatedProgress) {
      throw new NotFoundException(`Progress record with ID ${id} not found`);
    }

    return updatedProgress;
  }

  async delete(id: string): Promise<void> {
    const result = await this.progressModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Progress record with ID ${id} not found`);
    }
  }

  async getCompletedCourses(userId: string): Promise<Progress[]> {
    return await this.progressModel
      .find({
        user_id: new mongoose.Types.ObjectId(userId),
        completion_percentage: 100,
      })
      .populate('course_id');
  }


  async getDashboard(userId: string): Promise<any> {

    const progress = await this.progressModel.findOne({ user_id: userId }).exec();
    if (!progress) {
      throw new NotFoundException(`Dashboard for user ${userId} not found`);
    }

    // Calculate average score from responses **CURRENTLY INCORRECT
    const responses = await this.responseModel.find({ user_id: userId }).exec();
    const totalScore = responses.reduce((sum, response) => sum + response.score, 0);
    const averageScore = responses.length ? totalScore / responses.length : 0;
    //averg for each course NOT DONE YET


    // Calculate course completion rate 
    const progressData = await this.progressModel.find({ user_id: userId }).exec();
    const courseCompletionRates = [];

    for (const progress of progressData) {
      const course = await this.courseModel.findById(progress.course_id).exec();
      const completionRate = progress.completion_percentage; 

      courseCompletionRates.push({
        courseTitle: course.title,
        completionRate: completionRate,
      });
    }

    // Engagement trends [attendance, how many students completed the course] -- disregard for now
    // const progressDataForCourse = await this.progressModel.find({ course_id: courseId }).exec();
    // const completedStudents = progressDataForCourse.filter(progress => progress.completion_percentage === 100).length;

    return {
      averageScore,
      courseCompletionRates,
      //engagementTrends,
      progress,
    };
  }

  // Instructor Analytics -- student engagement
  async getInstructorAnalytics(courseId: string) {

    const course = await this.courseModel.findById(courseId).exec();

    if (!course) {
      throw new Error('Course not found');
    }

    // Number of enrolled students
    const enrolledStudents = await this.progressModel.distinct('user_id', { course_id: courseId }).exec(); 

    // Number of students completed the course
    const completedStudents = await this.progressModel.find({course_id: courseId, completion_percentage: 100,}).exec();
    const completedStudentCount = completedStudents.length;

    // Number of students based on performance metrics
    const performanceMetrics = {
      belowAverage: 0,
      average: 0,
      aboveAverage: 0,
      excellent: 0,
    };

    for (const studentId of enrolledStudents) {
      const studentResponses = await this.responseModel
        .find({ user_id: studentId })
        .exec();
        // AVERAGE SCORE LOGIC IS CURRENTLY INCORRECT

      const totalScore = studentResponses.reduce((sum, response) => sum + response.score, 0);
      const averageScore = totalScore / studentResponses.length; 

      if (averageScore < 50) {
        performanceMetrics.belowAverage += 1;
      } else if (averageScore >= 50 && averageScore < 70) {
        performanceMetrics.average += 1;
      } else if (averageScore >= 70 && averageScore < 90) {
        performanceMetrics.aboveAverage += 1;
      } else {
        performanceMetrics.excellent += 1;
      }
    }

    return {
      enrolledStudentsCount: enrolledStudents.length,
      completedStudentsCount: completedStudentCount,
      performanceMetrics,
    };
  }
  // Instructor Analytics -- Reports on content effectiveness 
  // getting the rating --

}









