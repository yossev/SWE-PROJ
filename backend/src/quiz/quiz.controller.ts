/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
 
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { Quiz } from '../models/quizzes-schema';

@Controller('quiz')
export class quizController {
    constructor(private readonly quizService: QuizService) {} 
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)    
    @Get('findall')
    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.quizService.findAll();
    }

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get('singlequiz')
    async getQuizById(@Query('id') id: string): Promise<Quiz> {
        console.log('Received ID: ' + id);
        const quiz = await this.quizService.findById(id);  
        return quiz;
    }
    @UseGuards(AuthGuard)
    @Get('assigned')
        async getQuizByUserId(@Req() req ): Promise<Quiz> {
      const userid=req.cookies.userId;

          console.log('Fetching quiz for User ID:', userid);

      const quiz = await this.quizService.findByUserId(userid);

      if (!quiz) {
        throw new BadRequestException('No quiz found for the provided user ID.');
      }

      return quiz;
    }

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Put('updatequiz')
    async updateQuiz(@Req() req, @Query('id') id: string, @Body() quizData: UpdateQuizDto): Promise<Quiz> {
        const updatedQuiz = await this.quizService.update( req,id, quizData);
        return updatedQuiz;       
    }
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Delete('deletequiz')
    async deleteQuiz(@Req() req,@Query('id') id: string): Promise<Quiz> {
        const deletedquiz = await this.quizService.delete(req,id);
       return deletedquiz;
    }
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
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
    @Body('quizId') quizId: string, // Add quizId here
    @Body('userAnswers') userAnswers: string[],
    @Body('selectedQuestions') selectedQuestions: any[],
    @Query('userId') userId: string,
  ) {
    const evaluation = await this.quizService.evaluateQuiz(userAnswers, selectedQuestions, userId, quizId); // Pass quizId to service
    return {
      success: true,
      message: 'Quiz evaluated successfully.',
      data: evaluation,
    };
  }

}