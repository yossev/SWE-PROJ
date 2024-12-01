import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ModuleService } from './module.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
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

    @Post('moduleLevel')
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
        return this.moduleService.uploadFile(file);
    }

    @Get('download')
    getFile(): StreamableFile {
      
      return this.moduleService.getFile();
    }


}


