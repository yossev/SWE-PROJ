/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
 
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { Quiz } from '../models/quizzes-schema';

interface DeleteQuizResponse {
  success: boolean;
  message: string;
  data: Quiz | null;
}

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
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get('getresponsestotal')
  async getResponsesTotal(@Query('id') id: string): Promise<any> {
    console.log('Received ID: ' + id);
    const quiz = await this.quizService.getresponsestotal(id);
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
      async updateQuiz(
        @Req() req,
        @Query('quizId') quizId: string, 
        @Body() updateData: UpdateQuizDto
      ): Promise<Quiz> {
        console.log("Received ID:", quizId);
        console.log("Update Data:", updateData); // Debugging log
      
        // Ensure the data is valid
        if (!quizId || !updateData) {
          throw new BadRequestException('Quiz ID or update data is missing.');
        }
      
        // Fetch the quiz document using the quizId
        const quiz = await this.quizService.findById(quizId);
      
        if (!quiz) {
          throw new BadRequestException('Quiz not found.');
        }     
        const userId = quiz.userId.toString();  // Ensure userId is a string
  
  // Pass the userId to the service method
        return await this.quizService.update(quizId, updateData, userId);
    }
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Delete('deletequiz')
    async deleteQuiz(@Query('id') id: string): Promise<any> {
      console.log("Received quiz ID for deletion:", id);  // Log quizId received from frontend

      try {
        const deletedQuiz = await this.quizService.delete(id); // Calling service method
        return { success: true, message: 'Quiz deleted successfully!' };
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw new UnauthorizedException('This quiz has already been taken by a student and cannot be deleted.');
        }
        throw new BadRequestException('Quiz not found or already deleted.');
      }
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
    @Body('quizId') quizId: string, // Quiz ID
    @Body('userAnswers') userAnswers: string[], // Array of user answers
    @Body('selectedQuestions') selectedQuestions: { questionId: string }[], // Array of selected questions with questionId
    @Query('userId') userId: string, // User ID passed as query parameter
  ) {
    console.log('POST /quiz/evaluate called');
    console.log('quizId:', quizId);
    console.log('userId:', userId);
    console.log('userAnswers:', userAnswers);
    console.log('selectedQuestions:', selectedQuestions);

    // Ensure selectedQuestions contains valid questionIds
    if (!selectedQuestions || selectedQuestions.length === 0) {
      throw new Error('Selected questions are missing.');
    }

    // Call the service to evaluate the quiz
    const evaluation = await this.quizService.evaluateQuiz(
      userAnswers,
      selectedQuestions,
      userId,
      quizId,
    );

    console.log('Evaluation Result:', evaluation);

    return {
      success: true,
      message: 'Quiz evaluated successfully.',
      data: evaluation,
    };
  }
}
