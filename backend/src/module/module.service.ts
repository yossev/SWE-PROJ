import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '../../models/module-schema'; 
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';
import { UploadedFile } from '@nestjs/common';
import { Types } from 'mongoose';
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Course } from 'models/course-schema';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}


@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Module') private readonly moduleModel: Model<Module>, 
    @InjectModel('Course') private readonly courseModel: Model<Course>,
  ) {}

  async createModule(createModuleDto : CreateModuleDto)
  {
    const createdModule = new this.moduleModel(createModuleDto);
    return createdModule.save();
  }

  async updateModule(id : string , updateModuleDto : UpdateModuleDto)
  {
    const module = await this.moduleModel.findById(id).exec();
    if(module)
    {
      Object.assign(module, updateModuleDto) // Update Course
        return module.save()
    }
    return null;
  }

  async checkModuleCompatibility(moduleId: string , performanceMetric : string)
  {
    var performanceLevel : String;
    if (performanceMetric === 'Above Average') {
      performanceLevel = 'Hard';
    } else if (performanceMetric === 'Average') {
      performanceLevel = 'Medium';
    } else {
      performanceLevel = 'East';
    }

    var moduleDifficulty : String = (await this.moduleModel.findById(moduleId).exec()).difficulty;
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

  async uploadFile(module_id : string , fileName : string , @UploadedFile() file: Express.Multer.File) {
    const module = await this.moduleModel.findById(new Types.ObjectId(module_id)).exec();
    await module.resources.push(fileName);
    await module.save();
    return 'File upload API';
  }

  getFile(module_id : string , fileName : string): StreamableFile {
    const fileUrl = "uploads/" + fileName;
    const filearray = fileUrl.split("/", 2);
    const fileNameNew = filearray[1].split("." , 3)[0] + "." + filearray[1].split("." , 3)[2];
    console.log(fileNameNew);
    const file = createReadStream(join(process.cwd(), fileUrl));
    return new StreamableFile(file , {
      type: 'application/octet-stream',
      disposition: 'attachment; filename="' + fileNameNew + '"',
    });
  }

  async getAllCourseModules(course_id : string)
  {
    const modules = await this.moduleModel.find({course_id : course_id});

    return modules;
  }



  
}
