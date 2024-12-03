import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { Quiz } from '../../models/quizzes-schema';
import { CreateProgressDTO } from './dto/createProgress.dto';
import { UpdateProgressDTO } from './dto/updateProgress.dto';
import { Responses } from '../../models/responses-schema';
import { Course } from '../../models/course-schema';
import { Module } from '../../models/module-schema';
import mongoose from 'mongoose';
import * as PDFDocument from 'pdfkit';

import { Response } from 'express';
@Injectable()
export class ProgressService {
  constructor(
    @InjectModel('Progress') private progressModel: Model<ProgressDocument>,
    @InjectModel('Responses') private responseModel: Model<Responses>,
    @InjectModel('Course') private courseModel: Model<Course>,
    @InjectModel('Quiz') private quizModel: Model<Quiz>,
    @InjectModel('Module') private moduleModel: Model<Module>,

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

    // Looks good to me :P ~Yossef
    // Calculate student's average score for each course (THIS***)
    const modules = await this.moduleModel.find({ course_id: progress.course_id }).exec();

    const quizIds = [];
    for (const module of modules) {
      const quizzes = await this.quizModel.find({ module_id: module._id }).exec();
      quizzes.forEach(quiz => quizIds.push(quiz._id));
    }

    const responses = await this.responseModel.find({
      user_id: userId,
      quiz_id: { $in: quizIds },
    }).exec();

    const totalScore = responses.reduce((sum, response) => sum + (response.score || 0), 0);
    const averageScore = responses.length ? totalScore / responses.length : 0;


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
    //const progressDataForCourse = await this.progressModel.find({ course_id: courseId }).exec();
    // const completedStudents = progressDataForCourse.filter(progress => progress.completion_percentage === 100).length;

    return {
      averageScore,
      courseCompletionRates,
      //engagementTrends,
      progress,
    };
  }

  // Instructor Analytics -- student engagement
  async getInstructorAnalyticsStudentEngagement(courseId: string) {

    const course = await this.courseModel.findById(courseId).exec();

    if (!course) {
      throw new Error('Course not found');
    }

    // Number of enrolled students
    const enrolledStudents = await this.progressModel.distinct('user_id', { course_id: courseId }).exec();

    // Number of students completed the course
    const completedStudents = await this.progressModel.find({ course_id: courseId, completion_percentage: 100, }).exec();
    const completedStudentCount = completedStudents.length;

    // Number of students based on performance metrics
    const performanceMetrics = {
      belowAverage: 0,
      average: 0,
      aboveAverage: 0,
      excellent: 0,
    };

    for (const studentId of enrolledStudents) {
      // Calculating **total** average score of student - this logic is same as GPA logic
      // This is students overall performance -- not tied to any course or module but overall
      const responses = await this.responseModel.find({ user_id: studentId }).exec();
      const totalScore = responses.reduce((sum, response) => sum + (response.score || 0), 0);
      const averageScore = responses.length ? totalScore / responses.length : 0;

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

  async getInstructorAnalyticsContentEffectiveness(courseId: string) {
//(THIS******)
    const course = await this.courseModel.findById(courseId).exec();

    if (!course) {
      throw new Error('Course not found');
    }
  }
  //Instructor Analytics -- Reports on assessment results
  async getInstructorAnalyticsAssessmentResults(courseId: string) {

    const course = await this.courseModel.findById(courseId).exec();

    if (!course) {
      throw new Error('Course not found');
    }
    const quizzes = await this.quizModel.find({ course_id: courseId }).exec();

    if (!quizzes || quizzes.length === 0) {
      return { message: 'No quizzes available for this course', results: [] };
    }

    const results = [];
    for (const quiz of quizzes) {

      const responses = await this.responseModel.find({ quiz_id: quiz._id }).exec();
      const totalScores = responses.reduce((sum, response) => sum + response.score, 0);
      const numParticipants = responses.length;
      const averageScore = numParticipants > 0 ? totalScores / numParticipants : 0;

      results.push({
        quizId: quiz._id,
        averageScore,
        numParticipants,
      });
    }

    return { courseId, courseName: course.title, results };
  }

  // Downloadable Analytics for student engagement --allow instructors to download detailed reports about student progress and performance.
  async exportInstructorAnalyticsStudentEngagementPDF(courseId: string, res: Response) {
    const analytics = await this.getInstructorAnalyticsStudentEngagement(courseId);
    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment('instructor_analytics.pdf');
    doc.pipe(res);
    doc.fontSize(16).text('Instructor Analytics Report', { align: 'center' }).moveDown();
    doc.text(`Number of enrolled students: ${analytics.enrolledStudentsCount}`);
    doc.text(`Number of students who completed the course: ${analytics.completedStudentsCount}`);
    doc.text('Performance Metrics:');
    doc.text(`Number of students who are below average: ${analytics.performanceMetrics.belowAverage}`);
    doc.text(`Number of students who are Average: ${analytics.performanceMetrics.average}`);
    doc.text(`Number of students who are Above Average: ${analytics.performanceMetrics.aboveAverage}`);
    doc.text(`Number of students who are Excellent: ${analytics.performanceMetrics.excellent}`);
    doc.end();
  }
  //Downloadable Analytics for content effectiveness

  //Downlodable Analytics for Assessment Results

  async getStudentPerformace(userId: string, courseId: string) {
    const quizzes = await this.quizModel.find({ course_id: courseId })

    const quizPerformanceList = [];

    for (const quiz of quizzes) {
      const performance = await this.responseModel.findOne({ user_id: userId, quiz_id: quiz._id })

      if (performance) {
        quizPerformanceList.push({
          quizId: quiz._id,
          score: performance.score,
          SubmittedAt: performance.submittedAt
        })
      }
    }
    return quizPerformanceList;
  }

  // LOGIC FOR ATTENDANCE
  
  // RECORD ATTENDANCE
  async recordAttendance(userId: string, courseId: string, status: 'present' | 'absent'): Promise<void> {

    const progress = await this.progressModel.findOne({user_id: userId, course_id: userId }).exec()

    if (!progress) {
      throw new NotFoundException(`Progress record for user ${userId} in course ${courseId} not found`);
    }

    const attendanceRecord = {date: new Date(), status}
    progress.attendance = progress.attendance || [];
    progress.attendance.push(attendanceRecord);

    await progress.save();

  }
  // GET ATTENDANCE

  async getAttendance(userId: string, courseId: string): Promise<any> {

    const progress = await this.progressModel.findOne({user_id: userId, course_id: userId }).exec()

    if(!progress) {
      throw new NotFoundException(`Progress record for user ${userId} in course ${courseId} not found`);
    }

    return progress.attendance || [];

  }

  async calculateAttendanceRate(userId: string, courseId: string): Promise<any> {
    const attendanceRecords =  await this.getAttendance(userId, courseId)
    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(record => record.status  === 'Present')

    return totalClasses? (presentCount/ totalClasses) * 100 : 0;

  }
}









