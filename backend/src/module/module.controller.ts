import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ModuleService } from './module.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('interactive')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {} 

    @Post()
    async createModule(@Body() createModuleDto: CreateModuleDto)
    {
        return this.moduleService.createModule(createModuleDto);

    }

    @Put(':id')
    async updateModule(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
        return this.moduleService.updateModule(id, updateModuleDto);
    }

    async checkModuleCompatibility(@Param('id') id: string)
    {
        return this.moduleService.checkModuleCompatibility(id , 'Above Average');
        //placeholder value , CHANGE ASAP!!
    }

    
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const filename = `${uniqueSuffix}${ext}`;
              callback(null, filename);
            },
          }),
        }),
      )
    async uploadFile(@UploadedFile() file: Express.Multer.File)
    {
        this.moduleService.uploadFile(file);
    }



    @Get()
    async getAllQuizzes(): Promise<Quiz[]> {
        return await this.moduleService.findAll();
    }
    @Get(':id')
    async getQuizById(@Param('id') id: string):Promise<Quiz> {
        const quiz = await this.moduleService.findById(id);
        return quiz;
    }

    @Post()
    async createQuiz(@Body()quizData: CreateQuizDto) :Promise<Quiz> {
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

     @Post('generate/:moduleId')
     async generateQuiz(
       @Param('moduleId') moduleId: string,
       @Body('userAnswers') userAnswers: string[] 
     ): Promise<any> {
       const generatedQuiz = await this.moduleService.generateQuiz(moduleId, userAnswers);
       return generatedQuiz;
     }

}


