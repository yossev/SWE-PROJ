import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';
@Injectable()
export class ModuleService {
  // Inject the Quiz model
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
  ) {}
  async findAll(): Promise<Quiz[]> {
    let quizzes= await this.quizModel.find();
    return quizzes;
}
async findById(id: string): Promise<Quiz> {
    return await this.quizModel.findById(id);  
}
async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = new this.quizModel(createQuizDto); 
    return await newQuiz.save();  
  }
  async update(id: string, updateData: UpdateQuizDto): Promise<Quiz> {
    return await this.quizModel.findByIdAndUpdate(id, updateData, { new: true });  
}
  async delete(id: string): Promise<Quiz> {
    return await this.quizModel.findByIdAndDelete(id); 
}

}
