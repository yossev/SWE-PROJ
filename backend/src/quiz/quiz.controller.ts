import { Body, Controller, Delete, Get, Param, Post, Put,BadRequestException } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { QuestionBank } from '../../models/questionbank-schema';
import { UserModule} from '../user/user/user.module';
import {ProgressDocument} from '../../models/progress-schema';
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
@Get('assigned')
async getQuizByUserId(@Query('userId') userId: string): Promise<Quiz> {
  console.log('Fetching quiz for User ID:', userId);

  const quiz = await this.quizService.findByUserId(userId);

  if (!quiz) {
    throw new BadRequestException('No quiz found for the provided user ID.');
  }

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

    @Post('generateQuiz')
  async generateQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @Query('userId') userId: string
  ) {
    
    const quiz = await this.quizService.generateQuiz(createQuizDto, userId);

    return {
      success: true,
      message: 'Quiz generated and saved successfully.',
      data: quiz,
    };
    
  }
  @Post('evaluate')
  async evaluateQuiz(
    @Body('userAnswers') userAnswers: string[],
    @Body('selectedQuestions') selectedQuestions: any[],
    @Query('userId') userId: string,
    @Query('moduleId') moduleId: string
  ) {
    const evaluation = await this.quizService.evaluateQuiz(userAnswers, selectedQuestions, userId, moduleId);
    return {
      success: true,
      message: 'Quiz evaluated successfully.',
      data: evaluation,
    };
  } 
}