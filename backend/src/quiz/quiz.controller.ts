import { Body, Controller, Delete, Get, Param, Post, Put,BadRequestException } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { QuestionBank } from '../../models/questionbank-schema';
import { UserModule} from '../user/user/user.module';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Query } from '@nestjs/common';
@Controller('quiz')
export class quizController {
    constructor(private readonly quizService: QuizService) {} 

    @Get('findall')
    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.quizService.findAll();
    }
    @Get('singlequiz')
async getQuizById(@Query('id') id: string): Promise<Quiz> {
    console.log('Received ID: ' + id);
    const quiz = await this.quizService.findById(id);  
    return quiz;
}

@Put('updatequiz')
async updateQuiz(@Query('id') id: string, @Body() quizData: UpdateQuizDto): Promise<Quiz> {
        const updatedQuiz = await this.quizService.update(id, quizData);
        return updatedQuiz;       
    }
    
    @Delete('deletequiz')
    async deleteQuiz(@Query('id') id: string): Promise<Quiz> {
        const deletedquiz = await this.quizService.delete(id);
       return deletedquiz;
    }

    @Post('generate')
async generateQuiz(
  @Body() createQuizDto: CreateQuizDto, 
  @Query('performance_metric') performanceMetric: string,
  @Query('userId') userId: string
) {
      if (!['Above Average', 'Medium', 'Below Average'].includes(performanceMetric)) {
        throw new BadRequestException('Invalid performance metric provided.');
      }
  
      try {
        const quiz = await this.quizService.generateQuiz(createQuizDto, performanceMetric, [], userId);  // Pass userId
        return {
          success: true,
          message: 'Quiz generated successfully.',
          data: quiz,
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

}


 
