/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ModuleService } from './module.service'; 
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
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/auth/guards/authorization.guards';
import { AuthGuard } from 'src/auth/guards/authentication.guards';
import { InjectModel } from '@nestjs/mongoose';
import { Reply } from '../models/reply-schema';
import { Model } from 'mongoose';
import { Course } from '../../src/models/course-schema';

var fileNameParameter = ""

@Controller('modules')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService,@InjectModel(Course.name) private courseModel: Model<Course>) {} 
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Post('create')
    async createModule(@Req() req,@Body() createModuleDto: CreateModuleDto)
    {
   
        return this.moduleService.createModule(req,createModuleDto);

    }
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Put(':id')
    async updateModule(@Param('id') id: string, @Req() req,@Body() updateModuleDto: UpdateModuleDto) {
        return this.moduleService.updateModule(id, req,updateModuleDto);
    }

    @Post('moduleLevel')
    async checkModuleCompatibility(@Param('id') id: string)
    {
        return this.moduleService.checkModuleCompatibility(id , 'Above Average');
        //placeholder value , CHANGE ASAP!!
    }
    @UseGuards(AuthGuard)
    @Get('coursemodules/:id')
    async getAllCourseModules(@Req() req,@Param('id') course_id : string)
    {
      const userid=req.cookies.userId;
      const course=this.courseModel.findById(course_id);
      let enrolled=false;
      (await course).students.forEach(student => {
          if(student._id.toString()===userid){
            enrolled=true;
          }
      })
      if(!enrolled){
        throw new Error("You are not enrolled in this course");
      }

      return this.moduleService.findAllCourseModules(course_id);
    }

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Post('upload/:id')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
              const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
              const ext = extname(file.originalname);
              const fileNameNoExtension = file.originalname.split("." , 2)[0];
              const filename =  `${fileNameNoExtension}.${uniqueSuffix}${ext}`;
              fileNameParameter = filename
              callback(null, filename);
            },
          }),
        }),
      )
    async uploadFile(@Req() req,@Param('id') module_id : string, @UploadedFile() file: Express.Multer.File)
    {
        return this.moduleService.uploadFile(req,file , module_id , fileNameParameter);
    }

    @Get('download/:id/:file')
    getFile(@Param('id') module_id : string , @Param('file') file : string): StreamableFile {
      
      return this.moduleService.getFile(file);
    }


}


