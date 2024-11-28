import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

    @Post()
    async createQuiz(@Body()quizData: CreateQuizDto) :Promise<Quiz> {
        const newQuiz = await this.quizService.create(quizData);
        return newQuiz;
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

     @Post('generate/:moduleId')
     async generateQuiz(
       @Param('moduleId') moduleId: string,
       @Body('userAnswers') userAnswers: string[] 
     ): Promise<any> {
       const generatedQuiz = await this.quizService.generateQuiz(moduleId, userAnswers);
       return generatedQuiz;
     }

}


 
