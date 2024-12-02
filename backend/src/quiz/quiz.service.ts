import { Injectable ,UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { Module } from '../../models/module-schema';
import { QuestionBank } from '../../models/questionbank-schema';
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { User ,UserSchema } from '../../models/user-schema';
import { QuestionType, DifficultyLevel } from './DTO/quiz.question.dto'; 
import { UserModule} from '../user/user/user.module';
import mongoose from 'mongoose';
@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User>, 
  ) {}

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.find();
  }

  async findById(id: string): Promise<Quiz> {
    const inpStr: string= id;
    const objectId = new mongoose.Types.ObjectId(inpStr);  
    return await this.quizModel.findById(objectId).exec();
}


async update(id: string, updateData: UpdateQuizDto): Promise<Quiz> {
  const objectId = new mongoose.Types.ObjectId(id);  
  return await this.quizModel.findByIdAndUpdate(objectId, updateData, { new: true }).exec();
}


async delete(id: string): Promise<Quiz> {
  const objectId = new mongoose.Types.ObjectId(id);  
  return await this.quizModel.findByIdAndDelete(objectId).exec();
}


async generateQuiz(createQuizDto: CreateQuizDto, performance_metric: string, userAnswers: string[], userId: string): Promise<any> {
  const objectIdUser = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId
  const user = await this.userModel.findById(objectIdUser);
  
  if (!user || user.role !== 'instructor') {
    throw new UnauthorizedException('Only instructors can create quizzes.');
  }

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

  let selectedQuestions = this.getRandomQuestions(questions, numberOfQuestions);
  let correctAnswersCount = 0;
  let incorrectAnswers = [];
  selectedQuestions.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    if (userAnswer === question.correctAnswer) {
      correctAnswersCount++;
    } else {
      incorrectAnswers.push({
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer,
      });
    }
  });

  const score = (correctAnswersCount / numberOfQuestions) * 100;

  let feedbackMessage = '';
  if (score < 60) {
    feedbackMessage = 'You have not scored enough. We recommend revisiting the module content and studying the material again.';
  } else {
    feedbackMessage = 'Great job! You have passed the quiz. Keep up the good work!';
  }

  const quizResult = {
    moduleId,
    questions: selectedQuestions,
    userAnswers,
    score,
    feedbackMessage,
    incorrectAnswers,
    created_at: new Date(),
    userId: objectIdUser, // Use ObjectId for userId
  };

  return {
    success: true,
    score,
    feedbackMessage,
    incorrectAnswers,
    message: 'Quiz completed and feedback provided.',
  };
}

  private getRandomQuestions(questions: any[], count: number): any[] {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
  
  private shuffleArray(array: any[]): any[] {
    return array.sort(() => 0.5 - Math.random());
  }
   
}
