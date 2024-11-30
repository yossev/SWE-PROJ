import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { QuestionBank } from '../../models/questionbank-schema';
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';
import { User } from '../../models/user-schema';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User> 
  ) {}

 
  async findAll(userId: string): Promise<QuestionBank[]> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can search for questions in the question bank.');
    }
    return await this.questionBankModel.find();
  }


  async findById(id: string, userId: string): Promise<QuestionBank> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can search for specific question in the question bank.');
    }
    return await this.questionBankModel.findById(id);
  }

  async create(createQuestionBankDto: CreateQuestionBankDto, userId: string): Promise<QuestionBank> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can add questions to the question bank.');
    }
    const newQuestionBank = new this.questionBankModel(createQuestionBankDto);
    return await newQuestionBank.save();
  }


  async update(id: string, updateData: UpdateQuestionBankDto, userId: string): Promise<QuestionBank> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can update questions in the question bank.');
    }
    return await this.questionBankModel.findByIdAndUpdate(id, updateData, { new: true });
  }


  async delete(id: string, userId: string): Promise<QuestionBank> {
    const user = await this.userModel.findById(userId);
    if (!user || user.role !== 'instructor') {
      throw new UnauthorizedException('Only instructors can delete questions in the question bank.');
    }
    return await this.questionBankModel.findByIdAndDelete(id);
  }
}
