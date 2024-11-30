import { Body, Controller, Delete, Get, Param, Post, Put,BadRequestException } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
@Controller('Quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {} 

    @Get()
    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.quizService.findAll();
    }
    @Get(':id')
    async getQuizById(@Param('id') id: string):Promise<Quiz> {
        const quiz = await this.quizService.findById(id);
        return quiz;
    }

    @Put(':id')
    async updateQuiz(@Param('id') id:string,@Body()quizData: UpdateQuizDto) :Promise<Quiz>{
        const updatedQuiz = await this.quizService.update(id, quizData);
        return updatedQuiz;       
    }
    
    @Delete(':id')
    async deleteQuiz(@Param('id')id:string):Promise<Quiz>  {
        const deletedquiz = await this.quizService.delete(id);
       return deletedquiz;
    }

    @Post('generate')
    async generateQuiz(
      @Body() createQuizDto: CreateQuizDto,
      @Body('performance_metric') performanceMetric: string,
      @Body('userAnswers') userAnswers: string[], // Answers submitted by the user
      @Body('userId') userId: string, // User ID to identify the student
    ) {
      // Validate performance metric
      if (!['Above Average', 'Average', 'Below Average'].includes(performanceMetric)) {
        throw new BadRequestException('Invalid performance metric provided.');
      }
  
      try {
        // Call service to generate the quiz and provide feedback
        const quizResult = await this.quizService.generateQuiz(createQuizDto, performanceMetric, userAnswers, userId);
        return {
          success: true,
          message: 'Quiz completed successfully.',
          data: quizResult,
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

}


 
