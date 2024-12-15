/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, Res } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from '../models/progress-schema';
import { CreateProgressDTO } from './dto/createProgress.dto';
import { UpdateProgressDTO } from './dto/updateProgress.dto';
import { Response } from 'express';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  // Create a new progress record
  @Post('createprogress')
  async create(@Body() progressData: CreateProgressDTO): Promise<Progress> {
    return this.progressService.create(progressData);
  }


  // Get all progress records
  @Get()
  async findAll(): Promise<Progress[]> {
    return this.progressService.findAll();
  }

  // Get a specific progress record by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Progress> {
    return this.progressService.findOne(id);
  }

  // Update a specific progress record by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() progressData: UpdateProgressDTO,
  ): Promise<Progress> {
    return this.progressService.update(id, progressData);
  }

  // Delete a specific progress record by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.progressService.delete(id);
  }

  // Get completed courses
  @Get('completed/:userId')
  async getCompletedCourses(@Param('userId') userId: string) {
    return await this.progressService.getCompletedCourses(userId);
  }

  // Get dashboard
  @Get('dashboard/:userId')
  async getDashboard(@Param('userId') userId: string) {
    return await this.progressService.getDashboard(userId);
  }

  //getInstructorAnalyticsAssessmentResults
  @Get('assessment-results/:userId')
  async getInstructorAnalyticsAssessmentResults(@Param('userId') courseId: string) {
    return await this.progressService.getInstructorAnalyticsAssessmentResults(courseId);
  }
  //getInstructorAnalyticsContentEffectiveness
  @Get('content-effectiveness/:courseId/:userId')
  async getInstructorAnalyticsContentEffectiveness(@Param('courseId') courseId: string, @Param('userId') userId:string) {
    return await this.progressService.getInstructorAnalyticsContentEffectiveness(courseId, userId);
  }

  // getInstructorAnalyticsStudentEngagement
  @Get('student-engagement/:courseId')
  async getInstructorAnalyticsStudentEngagement(@Param('courseId') courseId: string,) {
    return await this.progressService.getInstructorAnalyticsStudentEngagement(courseId);
  }

  @Get('/export-student-engagement/pdf/:courseId')
  async exportStudentEngagementPDF(@Param('courseId') courseId: string, @Res() res: Response) {
    await this.progressService.exportInstructorAnalyticsStudentEngagementPDF(courseId, res);
  }

  @Get('/export-assessment-results/pdf/:courseId')
  async exportAssessmentResultPDF(@Param('courseId') courseId: string, @Res() res: Response) {
    await this.progressService.exportInstructorAnalyticsAssessmentResultsPDF(courseId, res);
  }

  @Get('/export-content-effectivenes/pdf/:courseId')
  async exportContentEffectivenessPDF(@Param('courseId') courseId: string, userId: string, @Res() res: Response) {
    await this.progressService.exportInstructorAnalyticsContentEffectivenessPDF(courseId, userId, res);
  }

  @Get(':userId/performance')
  async getUserPerformance(@Param('userId') userId: string) {
    const classification = await this.progressService.classifyUserPerformance(userId);
    return {
      userId,
      classification,
    };
  }



}
