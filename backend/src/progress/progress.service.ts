import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { CreateProgressDTO } from './dto/createProgress.dto'; 
import { UpdateProgressDTO } from './dto/updateProgress.dto';  
import { Responses } from '../../models/responses-schema';  
@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
        @InjectModel(Response.name) private responseModel: Model<Responses>,
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

  async getDashboard(userId: string, courseId: string): Promise<any> {

    const progress = await this.progressModel.findOne({ user_id: userId}).exec();
    if (!progress) {
      throw new NotFoundException(`Dashboard for user ${userId} not found`);
    }

    // Calculate average score from responses
    const responses = await this.responseModel.find({ user_id: userId }).exec(); // All responses for the student
    const totalScore = responses.reduce((sum, response) => sum + response.score, 0);
    const averageScore = responses.length ? totalScore / responses.length : 0;

    // Calculate course completion rates
    const progressData = await this.progressModel.find({ user_id: userId }).exec();
    const totalCourses = progressData.length; 
    const completedCourses = progressData.filter(progress => progress.completion_percentage === 100).length;
    const completionRate = totalCourses ? (completedCourses / totalCourses) * 100 : 0;

    // Engagement trends [attendance, how many students completed the course]
    const progressDataForCourse = await this.progressModel.find({ course_id: courseId }).exec();
    const completedStudents = progressDataForCourse.filter(progress => progress.completion_percentage === 100).length;

    return {
      averageScore,
      completionRate,
      //engagementTrends,
      progress, 
    };
  }

    async delete(id: string): Promise<void> {
        const result = await this.progressModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Progress record with ID ${id} not found`);
        }
    }

}


