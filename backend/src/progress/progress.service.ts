import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../../models/progress-schema';
import { CreateProgressDTO } from './createProgress.dto'; 
import { UpdateProgressDTO } from './updateProgress.dto';  
import {Types} from 'mongoose';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    ) { }

  async create(createProgressDto: CreateProgressDTO): Promise<Progress> {
    const { user_id, course_id, completion_percentage, last_accessed } = createProgressDto;
    // Convert user_id and course_id from string to ObjectId
    const newProgress = new this.progressModel({
      user_id: new Types.ObjectId(user_id),  
      course_id: new Types.ObjectId(course_id),  
      completion_percentage,
      last_accessed,
    });
    return newProgress.save();  
  }
      
     
    async findAll(): Promise<Progress[]> {
        return this.progressModel.find().exec();
    }

    async findOne(id: string): Promise<Progress> {
        const progress = await this.progressModel.findOne({ _id: id }).exec();
        if (!progress) {
            throw new NotFoundException(`Progress record with ID ${id} not found`);
        }
        return progress;
    }

    async update(id: string, updateProgressDto: UpdateProgressDTO): Promise<Progress> {
        const { user_id, course_id, completion_percentage, last_accessed } = updateProgressDto;
        const updatedProgress = await this.progressModel
          .findOneAndUpdate(
            { _id: id },
            {
              user_id: new Types.ObjectId(user_id),  
              course_id: new Types.ObjectId(course_id),  
              completion_percentage,
              last_accessed,
            },
            { new: true }  
          )
          .exec();

        if (!updatedProgress) {
          throw new NotFoundException(`Progress record with ID ${id} not found`);
        }
    
        return updatedProgress;
      }

    async delete(id: string): Promise<void> {
        const result = await this.progressModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Progress record with ID ${id} not found`);
        }
    }

}


