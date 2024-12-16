/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

 
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { Module } from '../../src/models/module-schema'
import { QuestionBank } from '../../src/models/questionbank-schema';
import { UpdateModuleDto } from './DTO/module.update.dto';
import { CreateModuleDto } from './DTO/module.create.dto';
import { Course } from 'models/course-schema';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Module') private readonly moduleModel: Model<Module>, 
    @InjectModel('Course') private readonly courseModel: Model<Course>,
  ) {}

  async findAll(): Promise<Module[]> {
    return await this.moduleModel.find();
  }

  async findById(id: string): Promise<Module> {
    return await this.moduleModel.findById(id);
  }

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const newModule = new this.moduleModel(createModuleDto);
    return await newModule.save();
  }

  async update(id: string, updateData: UpdateModuleDto): Promise<Module> {
    return await this.moduleModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<Module> {
    return await this.moduleModel.findByIdAndDelete(id);
  }

}
