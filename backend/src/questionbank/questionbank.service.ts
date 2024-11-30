import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { QuestionBank } from '../../models/questionbank-schema';
import { UpdateQuestionBankDto } from './DTO/questionbank.update.dto';
import { CreateQuestionBankDto } from './DTO/questionbank.create.dto';
import { User } from '../../models/user-schema';  // Assuming you have a User model

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User> // Inject the User model
  ) {}

  async findAll(): Promise<QuestionBank[]> {
    return await this.questionBankModel.find();
  }

  async findById(id: string): Promise<QuestionBank> {
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

  async update(id: string, updateData: UpdateQuestionBankDto): Promise<QuestionBank> {
    return await this.questionBankModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<QuestionBank> {
    return await this.questionBankModel.findByIdAndDelete(id);
  }
}
