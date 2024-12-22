import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException } from '@nestjs/common';
import { QuizService } from './quiz.service'; 
import { Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { QuestionBank } from '../../models/questionbank-schema';
import { ProgressDocument } from '../../models/progress-schema';
import { Responses, ResponsesDocument } from '../../models/responses-schema'; 
import mongoose from 'mongoose';
import { Query } from '@nestjs/common';

interface DeleteQuizResponse {
  success: boolean;
  message: string;
  data: Quiz | null;
}

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
async updateQuiz(
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

  // Extract the userId from the fetched quiz document and cast it to string
  const userId = quiz.userId.toString();  // Ensure userId is a string
  
  // Pass the userId to the service method
  return await this.quizService.update(quizId, updateData, userId);
}

@Delete('deletequiz')
async deleteQuiz(@Query('id') id: string): Promise<any> {
  console.log('Received quiz ID for deletion:', id);  // This will now show the actual ID received
  try {
    const deletedQuiz = await this.quizService.delete(id);
    return {
      success: true,
      message: 'Quiz deleted successfully!',
      data: deletedQuiz,
    };
  } catch (error) {
    throw new BadRequestException(error.message);
  }
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
