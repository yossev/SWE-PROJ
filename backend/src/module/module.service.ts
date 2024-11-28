import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,  // Use the Quiz model directly
  ) {}

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.find();
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

  async generateQuiz(moduleId: string, performanceLevel: 'Easy' | 'Medium' | 'Hard'): Promise<Quiz> {
    // Fetch quizzes for the given moduleId
    const quizzes = await this.quizModel.find({ module_id: moduleId });

    if (!quizzes || quizzes.length === 0) {
      throw new Error('No quizzes found for the specified module.');
    }

    // Select a random quiz (you can refine this to select based on other criteria)
    const selectedQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];

    // Filter questions based on the performance level
    const filteredQuestions = selectedQuiz.questions.filter((q) => q.difficulty_level === performanceLevel);

    // Randomly select questions
    const selectedQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, selectedQuiz.number_of_questions);

    // Create a new quiz object (could be stored as a new quiz instance or used in-memory)
    const generatedQuiz = new this.quizModel({
      module_id: moduleId,
      question_type: selectedQuiz.question_type,
      number_of_questions: selectedQuestions.length,
      questions: selectedQuestions,
      created_at: new Date(),
    });

    return await generatedQuiz.save();
  }
}
