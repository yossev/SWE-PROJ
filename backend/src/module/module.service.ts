import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '../../models/module-schema'; 
import { StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';
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

  async uploadFile(@UploadedFile() file: Express.Multer.File , moduleId : string , fileName: string) {
    var currentModule = await this.moduleModel.findById(new mongoose.Types.ObjectId(moduleId)).exec();
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
