/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../models/progress-schema';
import { Quiz } from '../models/quizzes-schema';
import { CreateProgressDTO } from './dto/createProgress.dto';
import { UpdateProgressDTO } from './dto/updateProgress.dto';
import { Responses } from '../models/responses-schema';
import { Course } from '../models/course-schema';
import { Module } from '../models/module-schema';
import { RatingService } from '../rating/rating.service';
import mongoose from 'mongoose';
import * as PDFDocument from 'pdfkit';
import { Response } from 'express';
import { Rating } from 'models/rating-schema';
@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>,
    @InjectModel(Responses.name) private responseModel: Model<Responses>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
    @InjectModel(Module.name) private moduleModel: Model<Module>,
    @InjectModel(Rating.name) private ratingModel: Model<Rating>,
    private ratingService: RatingService,

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
  async findProgressByUserId(userId: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ user_id: userId }).exec();
    if (!progress) {
      throw new NotFoundException(`Progress record with ID ${userId} not found`);
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

  // LOGIC FOR ATTENDANCE

  // RECORD ATTENDANCE
  async recordAttendance(userId: string, courseId: string, status: 'present' | 'absent'): Promise<void> {

    const progress = await this.progressModel.findOne({ user_id: userId, course_id: courseId }).exec()

    if (!progress) {
      throw new NotFoundException(`Progress record for user ${userId} in course ${courseId} not found`);
    }

    const attendanceRecord = { date: new Date(), status }
    progress.attendance = progress.attendance || [];
    progress.attendance.push(attendanceRecord);

    await progress.save();

  }
  // GET ATTENDANCE

  async getAttendance(userId: string, courseId: string): Promise<any> {

    const progress = await this.progressModel.findOne({ user_id: userId, course_id: courseId }).exec()

    if (!progress) {
      throw new NotFoundException(`Progress record for user ${userId} in course ${courseId} not found`);
    }

    return progress.attendance || [];

  }

   async calculateAttendanceRate(userId: string, courseId: string): Promise<number> {
    const progress = await this.progressModel.findOne({
      user_id: userId,
      course_id: courseId,
    }).exec();
    if (!progress || !progress.attendance || progress.attendance.length === 0) {
      return 0;
    }
    const totalDays = progress.attendance.length;
    const presentDays = progress.attendance.filter((record) => record.status === "present").length;
    const attendanceRate = (presentDays / totalDays) * 100;
    return attendanceRate;
  }

  async getDashboard(userId: string): Promise<any> {

    console.log('Querying progress for userId:', userId);
    const progress = await this.progressModel.findOne({ user_id: userId}).exec();
    console.log('Progress found:', progress);
    if (!progress) {
      throw new NotFoundException(`Dashboard for user ${userId} not found`);
    }

    // Calculate student's average score for each course 

    const modules = await this.moduleModel.find({ course_id: progress.course_id }).exec();
    console.log('course id ', progress.course_id)
    const quizIds = [];
    for (const module of modules) { //FOR EACH MODULE OF THIS COURSE - COURSE MAY HAVE MORE THAN 1 MODULE
      const quizzes = await this.quizModel.find({ module_id: module._id }).exec();
      quizzes.forEach(quiz => quizIds.push(quiz._id));
    }

    const responses = await this.responseModel.find({
      user_id: userId,
      quiz_id: { $in: quizIds }, //quiz_id present in quizIds array
    }).exec();

    const totalScore = responses.reduce((sum, response) => sum + (response.score || 0), 0);
    const averageScore = responses.length ? totalScore / responses.length : 0;
    const classification = await this.classifyUserPerformance(userId.toString());

    // Calculate course completion rate 
    const progressData = await this.progressModel.find({ user_id: userId }).exec();
    const courseCompletionRates = [];
    const completedCourses = [];

    for (const progress of progressData) {
      const course = await this.courseModel.findById(progress.course_id).exec();
      const completionRate = progress.completion_percentage;

      courseCompletionRates.push({
        //   courseTitle: course.title,
        completionRate: completionRate,
      });

      if (completionRate === 100) {
        const course = await this.courseModel.findById(progress.course_id).exec();
        completedCourses.push({
          courseId: progress.course_id,
          // courseTitle: course?.title || 'Unknown Course', 
        });
      }
    }

    // Engagement trends [attendance, how many students completed the course] 

    const engagementTrends = [];

    for (const progress of progressData) {
      const courseId = progress.course_id;
      const courseIdString: string = courseId.toString();

      const attendanceRate = await this.calculateAttendanceRate(userId, courseIdString);

      const completedStudents = await this.progressModel.find({
        course_id: courseId,
        completion_percentage: 100,
      }).exec();
      const completedStudentCount = completedStudents.length;

      engagementTrends.push({
        courseId: courseIdString,
        attendanceRate,
        completedStudentCount,
      });
    }

    return {
      averageScore,
      classification,
      completedCourses,
      courseCompletionRates,
      engagementTrends,
      progress,
    };
  }

  async classifyUserPerformance(userId: string) { 

    const responses = await this.responseModel.find({ user_id: userId }).exec();
    const totalScore = responses.reduce((sum, response) => sum + (response.score || 0), 0);
    const averageScore = responses.length ? totalScore / responses.length : 0;

    if (averageScore < 50) {
      return 'Below Average';
    } else if (averageScore >= 50 && averageScore < 70) {
      return 'Average';
    } else if (averageScore >= 70 && averageScore < 90) {
      return 'Above Average';
    } else {
      return 'Excellent';
    }
  }

  // Instructor Analytics -- student engagement 
  async getInstructorAnalyticsStudentEngagement(courseId: string) {

    const course = await this.courseModel.findById(courseId).exec();

    //if (!course) {
    //throw new Error('Course not found');
    // }

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
      const classification = await this.classifyUserPerformance(studentId.toString());

      if (classification === 'Below Average') {
        performanceMetrics.belowAverage += 1;
      } else if (classification === 'Average') {
        performanceMetrics.average += 1;
      } else if (classification === 'Above Average') {
        performanceMetrics.aboveAverage += 1;
      } else if (classification === 'Excellent') {
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

  async getInstructorAnalyticsContentEffectiveness(courseId: string, userId: string) {

    const course = await this.courseModel.findById(courseId).exec();
    //if (!course) {
    //throw new NotFoundException('Course not found');
    //}

    //const instructor = await this.courseModel.findById(userId).exec();
    //if (!instructor) {
    //throw new NotFoundException('Instructor not found');
    //}

    const courseRating = await this.ratingService.getCourseRating(courseId);

    const modules = await this.moduleModel.find({ course_id: courseId }).exec();
    const moduleRatings: { [moduleId: string]: number } = {};

    for (const module of modules) {
      const moduleIdStr = module._id.toString();
      const moduleRating = await this.ratingService.getModuleRating(moduleIdStr);
      moduleRatings[moduleIdStr] = moduleRating;
    }

    const instructorRating = await this.ratingService.getInstructorRating(userId);

    return {
      courseId,
      //courseTitle: course.title,
      courseRating,
      moduleRatings,
      instructorRating,
    };
  }

  //Instructor Analytics -- Reports on assessment results 
  async getInstructorAnalyticsAssessmentResults(courseId: string) {

    const course = await this.courseModel.findById(courseId).exec();

    // if (!course) {
    //   throw new Error('Course not found');
    // }

    const quizzes = await this.quizModel.find({ course_id: courseId }).exec();

    // if (!quizzes || quizzes.length === 0) {
    //   return { message: 'No quizzes available for this course', results: [] };
    // }

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
    // if (!analytics) {
    //   return res.status(404).send('Analytics data not found');
    // }
    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment('instructor_analytics_student_engagement.pdf');
    doc.pipe(res);
    doc.fontSize(16).text('Instructor Analytics Report - student engagement', { align: 'center' }).moveDown();
    doc.text(`Number of enrolled students: ${analytics.enrolledStudentsCount}`).moveDown();
    doc.text(`Number of students who completed the course: ${analytics.completedStudentsCount}`).moveDown();
    doc.text('Performance Metrics:').moveDown();
    doc.text(`Number of students who are below average: ${analytics.performanceMetrics.belowAverage}`).moveDown();
    doc.text(`Number of students who are Average: ${analytics.performanceMetrics.average}`).moveDown();
    doc.text(`Number of students who are Above Average: ${analytics.performanceMetrics.aboveAverage}`).moveDown();
    doc.text(`Number of students who are Excellent: ${analytics.performanceMetrics.excellent}`).moveDown();
    doc.end();
  }

  //Downloadable Analytics for content effectiveness 
  async exportInstructorAnalyticsContentEffectivenessPDF(courseId: string, userId: string, res: Response) {
    const analytics = await this.getInstructorAnalyticsContentEffectiveness(courseId, userId);

    // if (!analytics) {
    //   return res.status(404).send('Analytics data not found');
    // }

    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment('instructor_analytics_content_effectiveness.pdf');
    doc.pipe(res);
    doc.fontSize(16).text('Instructor Analytics Report - Content Effectiveness', { align: 'center' }).moveDown();
    //doc.text(`Course Title: ${analytics.courseTitle}`).moveDown();
    doc.text(`Course Rating: ${analytics.courseRating}`).moveDown();
    doc.text('Module Ratings:');
    for (const [moduleId, rating] of Object.entries(analytics.moduleRatings)) {
      doc.text(`Module ID: ${moduleId}, Rating: ${rating}`).moveDown();
    }
    doc.text(`Instructor Rating: ${analytics.instructorRating}`).moveDown();
    doc.end();
  }


  //Downlodable Analytics for Assessment Results 
  async exportInstructorAnalyticsAssessmentResultsPDF(courseId: string, res: Response) {
    const analytics = await this.getInstructorAnalyticsAssessmentResults(courseId);

    // if (!analytics.results || analytics.results.length === 0) {
    //   return res.status(404).send('No assessment results found for this course.');
    // }

    const doc = new PDFDocument();
    res.header('Content-Type', 'application/pdf');
    res.attachment('instructor_analytics_assessment_results.pdf');
    doc.pipe(res);
    doc.fontSize(16).text('Instructor Analytics - Assessment Results', { align: 'center' }).moveDown();
    doc.text(`Course: ${analytics.courseName}`);
    doc.text(`Course ID: ${analytics.courseId}`).moveDown();
    doc.text('Assessment Results:', { underline: true }).moveDown();
    analytics.results.forEach(result => {
      doc.text(`Quiz ID: ${result.quizId}`);
      doc.text(`Average Score: ${result.averageScore}`);
      doc.text(`Number of Participants: ${result.numParticipants}`).moveDown();
    });

    doc.end();
  }

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

}









