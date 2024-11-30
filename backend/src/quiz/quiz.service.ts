import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { Module } from '../../models/module-schema';
import { QuestionBank } from '../../models/questionbank-schema';
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { QuestionType, DifficultyLevel } from './DTO/quiz.question.dto'; 

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
  ) {}

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.find();
  }

  async findById(id: string): Promise<Quiz> {
    return await this.quizModel.findById(id);
  }

  async update(id: string, updateData: UpdateQuizDto): Promise<Quiz> {
    return await this.quizModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<Quiz> {
    return await this.quizModel.findByIdAndDelete(id);
  }

  async generateQuiz(createQuizDto: CreateQuizDto, performance_metric: string, userAnswers: string[]): Promise<any> {
    const { moduleId, numberOfQuestions, questionType } = createQuizDto;
  
    let difficultyLevels: string[];  
    if (performance_metric === 'Above Average') {
      difficultyLevels = [DifficultyLevel.Medium, DifficultyLevel.Hard];
    } else if (performance_metric === 'Average') {
      difficultyLevels = [DifficultyLevel.Easy, DifficultyLevel.Medium];
    } else {
      difficultyLevels = [DifficultyLevel.Easy];
    }
  

    let questionFilter: any = { moduleId, difficulty_level: { $in: difficultyLevels } };
  
    if (questionType === QuestionType.MCQ) {
      questionFilter.question_type = 'MCQ';
    } else if (questionType === QuestionType.TrueFalse) {
      questionFilter.question_type = 'True/False';
    } else if (questionType === QuestionType.Both) {
      questionFilter.question_type = { $in: ['MCQ', 'True/False'] }; 
    }
  
    const questions = await this.questionBankModel.find(questionFilter).lean();
  
    if (questions.length < numberOfQuestions) {
      throw new Error('Not enough questions in the question bank to generate the quiz.');
    }
  

    const distribution = Math.floor(numberOfQuestions / difficultyLevels.length);
    const remaining = numberOfQuestions % difficultyLevels.length;
  
    let selectedQuestions = [];
    for (let i = 0; i < difficultyLevels.length; i++) {
      const levelQuestions = questions.filter(q => q.difficulty_level === difficultyLevels[i]);
      const count = i === difficultyLevels.length - 1 ? distribution + remaining : distribution;
      selectedQuestions.push(...this.getRandomQuestions(levelQuestions, count));
    }

    selectedQuestions = this.shuffleArray(selectedQuestions);
  
    let score = 0;
    let feedback: any[] = [];
    selectedQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = question.correctAnswer;
  
      if (userAnswer === correctAnswer) {
        score += 1; 
      } else {
        
        feedback.push({
          question: question.question,
          userAnswer,
          correctAnswer,
          feedback: `Incorrect. The correct answer is: ${correctAnswer}, please revise this topic `, 
        });
      }
    });
  
    const quiz = new this.quizModel({
      moduleId,
      questions: selectedQuestions,
      created_at: new Date(),
    });
  
    await quiz.save();
  
    return {
      score: `${score} / ${numberOfQuestions}`, 
      feedback, 
    };
  }
  

  private getRandomQuestions(questions: any[], count: number): any[] {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
  
  private shuffleArray(array: any[]): any[] {
    return array.sort(() => 0.5 - Math.random());
  }
  
}
