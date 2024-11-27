import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ModuleService } from './module.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';
@Controller('interactive')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {} 

    @Get()
    // Get all quizzes
    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.moduleService.findAll();
    }
    @Get(':id')
    // Get a single quiz by ID
    async getQuizById(@Param('id') id: string):Promise<Quiz> {
        const quiz = await this.moduleService.findById(id);
        return quiz;
    }

    @Post()
    async createQuiz(@Body()quizData: CreateQuizDto) :Promise<Quiz> {// Get the new student data from the request body
        const newQuiz = await this.moduleService.create(quizData);
        return newQuiz;
    }

    @Put(':id')
    async updateQuiz(@Param('id') id:string,@Body()quizData: UpdateQuizDto) :Promise<Quiz>{
        const updatedQuiz = await this.moduleService.update(id, quizData);
        return updatedQuiz;       
    }
    
    @Delete(':id')
    async deleteQuiz(@Param('id')id:string):Promise<Quiz>  {
        const deletedquiz = await this.moduleService.delete(id);
       return deletedquiz;
    }


}


