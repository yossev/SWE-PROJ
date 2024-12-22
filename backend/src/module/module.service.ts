/* eslint-disable prettier/prettier */
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '../models/module-schema';
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { UploadedFile } from '@nestjs/common';

import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Course } from '../models/course-schema';
import { NotificationService } from 'src/notification/notification.service';


@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Module') private readonly moduleModel: Model<Module>, 
    @InjectModel('Course') private readonly courseModel: Model<Course>,
    private readonly notificationService: NotificationService
  ) {}

  async createModule(@Req() req, createModuleDto: CreateModuleDto) {
    const userid = req.cookies.userId;

    const course = await this.courseModel.findById(createModuleDto.course_id);
  
    if (!course) {
      throw new UnauthorizedException("Course not found");
    }
 
    if (userid.toString() !== course.created_by.toString()) {
      throw new UnauthorizedException("You are not authorized to create a module");
    }

    const createdModule = new this.moduleModel(createModuleDto);
    createdModule.valid_content = true;
    await createdModule.save();

    const message =` New module ${createdModule.title} for course ${course.title} has been added`;
    await this.notificationService.createNotification(course.students, message);
  
    return "Module created and added";
  }


  async updateModule(id : string ,@Req() req, updateModuleDto : UpdateModuleDto)
  {
    const userid=req.cookies.userId;
    const usedModule=await this.moduleModel.findById(id);
    const courseid=usedModule.course_id;
    const course=await this.courseModel.findById(courseid);
    if (userid!=course.created_by){
      throw new UnauthorizedException("You are not authorized to update this module");
    }
    const module = await this.moduleModel.findById(new mongoose.Types.ObjectId(id)).exec();
    if(module)
    {
      Object.assign(module, updateModuleDto) // Update Course
      const message = `Module ${usedModule.title} for course ${course.title} has been updated`;
      await this.notificationService.createNotification(
        (await course).students,
        message
    );
        return module.save()
    }
    
    return null;
  }


  async findAllCourseModules(id: string)
  {
    const result = await this.moduleModel.find({"course_id" : id});
    return result;
  }

  async getModule(id: string)
  {
    const module = await this.moduleModel.findById(new mongoose.Types.ObjectId(id)).exec(); 
    if(module)
    {
      console.log(module);
    }
    return module;
  }

  async checkModuleCompatibility(moduleId: string , performanceMetric : string)
  {
    let performanceLevel : string;
    if (performanceMetric === 'Above Average') {
      performanceLevel = 'Hard';
    } else if (performanceMetric === 'Average') {
      performanceLevel = 'Medium';
    } else {
      performanceLevel = 'East';
    }

    const moduleDifficulty : string = (await this.moduleModel.findById(moduleId).exec()).difficulty;
    switch(performanceLevel)
    {
      case 'Hard':
        return true;
      break;

      case 'Medium':
        if(moduleDifficulty === 'Hard')
        {
          return false;
        }
        else
        {
          return true;
        }
      break;

      case 'Easy':
        if(moduleDifficulty === 'Easy')
        {
          return true;
        }
        else
        {
          return false;
        }
    }

    return false;
  }

  async uploadFile(@Req() req,@UploadedFile() file: Express.Multer.File , moduleId : string , fileName: string) {
    const userid=req.cookies.userid;
    const usedModule=this.moduleModel.findById(new mongoose.Types.ObjectId(moduleId));
    const courseid=(await usedModule).course_id;
    const course=this.courseModel.findById(courseid);
    if (userid!=(await course).created_by){
      throw new UnauthorizedException("You are not authorized to update this module");
    }
    const currentModule = await this.moduleModel.findById(new mongoose.Types.ObjectId(moduleId)).exec();
    console.log('Current Module title is: ' + currentModule.title)
    currentModule.resources.push(fileName);
    currentModule.save();
    console.log('file is: ' + file);
    return 'File upload API';
  }

  getFile(fileUrl : string): StreamableFile {
    const fileRelativeUrl =  'uploads/' + fileUrl;
    const file = createReadStream(join(process.cwd(), fileRelativeUrl));
    return new StreamableFile(file , {
      type: 'application/octet-stream',
      disposition: 'attachment; filename="' + fileUrl + '"',
    });
  }




  
}