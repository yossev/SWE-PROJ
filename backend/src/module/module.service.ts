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

import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

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

  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file is: ' + file);
    return 'File upload API';
  }

  getFile(): StreamableFile {
    const fileurl =  'uploads/Course-Module-Quiz Elaboration.pdf';
    const filearray = fileurl.split("/", 2); 
    const filedest = filearray[1];
    const file = createReadStream(join(process.cwd(), fileurl));
    return new StreamableFile(file , {
      type: 'application/octet-stream',
      disposition: 'attachment; filename="' + filedest + '"',
    });
  }



  
}
