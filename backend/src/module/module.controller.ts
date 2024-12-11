import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ModuleService } from './module.service'; 
import {Quiz } from '../../models/quizzes-schema';   
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { UseInterceptors , Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UploadedFile } from '@nestjs/common';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

var currentFileName : string;

@Controller('modules')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {} 

    @Get('get/:id')
    async getModule(@Param('id') id : string)
    {
      return this.moduleService.getModule(id);
    }

    @Post('create')
    async createModule(@Body() createModuleDto: CreateModuleDto)
    {
        return this.moduleService.createModule(createModuleDto);

    }

    @Put('update')
    async updateModule(@Query('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
        return this.moduleService.updateModule(id, updateModuleDto);
    }

    @Post('moduleLevel')
    async checkModuleCompatibility(@Param('id') id: string)
    {
        return this.moduleService.checkModuleCompatibility(id , 'Above Average');
        //placeholder value , CHANGE ASAP!!
    }

    @Get('findcoursemodules')
    async findAllCourseModules(@Query('id') id : string)
    {
      return this.moduleService.findAllCourseModules(id);
    }
    
    @Post('upload/:id')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
              const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
              const name = file.originalname;
              const fileNameNoExtension = name.split(".")[0];
              const ext = extname(file.originalname);
              const filename = `${fileNameNoExtension}.${uniqueSuffix}${ext}`;
              currentFileName = filename;
              callback(null, filename);
            },
          }),
        }),
      )
    async uploadFile(@UploadedFile() file: Express.Multer.File , @Param('id') moduleId: string)
    {
      const fileName = currentFileName;
      console.log("Test -- filename is: " + fileName);
      return this.moduleService.uploadFile(file , moduleId , fileName);
    }

    @Get('download')
    getFile(@Query('fileUrl') fileUrl : string): StreamableFile {
      console.log('fileUrl is: ' + fileUrl);
      return this.moduleService.getFile(fileUrl);
    }


}


