import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { QuestionBank } from '../../src/models/questionbank-schema';
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';
import { User } from '../../src/models/user-schema';
import mongoose from 'mongoose';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User> 
  ) {}

 
  async findAll(): Promise<QuestionBank[]> {
    return await this.questionBankModel.find().exec();
}

  async findById(id: string): Promise<QuestionBank> {
    const inpStrId: string = id;
    const objectId = new mongoose.Types.ObjectId(inpStrId);
    return await this.questionBankModel.findById(objectId).exec();
  }
  
  async create(createQuestionBankDto: CreateQuestionBankDto): Promise<QuestionBank> {
    const newQuestionBank = new this.questionBankModel(createQuestionBankDto);
    return await newQuestionBank.save();
  }
  
  
  async update(id: string, updateData: UpdateQuestionBankDto): Promise<QuestionBank> {
    const inpStrId: string = id;
    const objectId = new mongoose.Types.ObjectId(inpStrId);
    return await this.questionBankModel.findByIdAndUpdate(objectId, updateData, { new: true }).exec();
  }
  
  
  async delete(id: string): Promise<QuestionBank> {
    const inpStrId: string = id;
    const objectId = new mongoose.Types.ObjectId(inpStrId);
    return await this.questionBankModel.findByIdAndDelete(objectId).exec(); 
  }
  
} 