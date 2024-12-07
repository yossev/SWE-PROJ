import { Injectable ,UnauthorizedException,BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../../models/quizzes-schema';
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
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDocument>,
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
  const inpStr: string= id;
  const objectId = new mongoose.Types.ObjectId(inpStr);  
  return await this.quizModel.findByIdAndUpdate(objectId, updateData, { new: true }).exec();
}


async delete(id: string): Promise<Quiz> {
  const inpStr: string= id;
  const objectId = new mongoose.Types.ObjectId(inpStr);  
  return await this.quizModel.findByIdAndDelete(objectId).exec();
}
async generateQuiz(createQuizDto: CreateQuizDto, performanceMetric: string, userId: string): Promise<any> {
  const { moduleId, numberOfQuestions, questionType } = createQuizDto;
  const allQuestions = await this.questionBankModel.find().lean();
  console.log('All Questions from Question Bank:', allQuestions);

  // Determine the difficulty levels based on performance metric
  let difficultyLevels: string[];
  if (performanceMetric === 'Above Average') {
    difficultyLevels = [DifficultyLevel.Medium, DifficultyLevel.Hard];
  } else if (performanceMetric === 'Average') {
    difficultyLevels = [DifficultyLevel.Easy, DifficultyLevel.Medium];
  } else {
    difficultyLevels = [DifficultyLevel.Easy];
  }

  // Log the input filter conditions
  console.log('Input Filter Conditions:', {
    moduleId,
    difficultyLevels,
    questionType,
  });

  // Define the question filter based on input parameters
  let questionFilter: any = {
    module_id: moduleId,
    difficulty_level: { $in: difficultyLevels },
  };

  // Adjust question filter based on question type
  console.log('Question Type from DTO:', questionType);
  if (questionType === QuestionType.MCQ) {
    questionFilter.question_type = 'MCQ';
  } else if (questionType === QuestionType.TrueFalse) {
    questionFilter.question_type = 'True/False';
  } else if (questionType === QuestionType.Both) {
    questionFilter.question_type = { $in: ['MCQ', 'True/False'] };
  }

  // Log the final filter condition before applying
  console.log('Final Question Filter:', questionFilter);

  // Apply the filter to allQuestions in-memory
  const questions = allQuestions.filter((q) => {
    console.log('Filtering question:', q);
    console.log('Question type from DB:', q.question_type);
    const matchesType =
      questionFilter.question_type === 'Both' ||
      q.question_type === questionFilter.question_type;
    console.log('Matches type:', matchesType);

    const matchesDifficulty = difficultyLevels.includes(q.difficulty_level);
    console.log('Matches difficulty:', matchesDifficulty);

    return (
      q.module_id.toString() === moduleId.toString() &&
      matchesDifficulty &&
      matchesType
    );
  });

  console.log('Filtered Questions:', questions);

  // Check if questions are empty
  if (questions.length === 0) {
    console.log('No questions matched the filter conditions.');
  }

  // Select random questions from the filtered list
  const selectedQuestions = this.getRandomQuestions(questions, numberOfQuestions);
  console.log('Selected Questions:', selectedQuestions);

  const transformedQuestions = selectedQuestions.map((q) => ({
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    difficultyLevel: q.difficulty_level,
  }));

  const quiz = {
    module_id: moduleId,
    questions: transformedQuestions,
    created_at: new Date(),
    userId: new mongoose.Types.ObjectId(userId), // Consider ensuring userId is valid
  };

  const savedQuiz = await new this.quizModel(quiz).save();
  console.log('Saved Quiz:', savedQuiz);

  // Prepare response questions with minimal data
  const responseQuestions = selectedQuestions.map((q) => ({
    question: q.question,
    options: q.options,
    id: q._id,
  }));

  return {
    quizId: savedQuiz._id,
    questions: responseQuestions,
  };
}


  private getRandomQuestions(questions: any[], count: number): any[] {
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
    
  }
  
  private shuffleArray(array: any[]): any[] {
    return array.sort(() => 0.5 - Math.random());
  }

  async evaluateQuiz(
    userAnswers: string[],
    selectedQuestions: any[],
    userId: string,
    moduleId: string
  ): Promise<any> {
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
    const score = (correctAnswersCount / selectedQuestions.length) * 100;
    let feedbackMessage = '';
    if (score < 60) {
      feedbackMessage = 'You have not scored enough. We recommend revisiting the module content and studying the material again.';
    } else {
      feedbackMessage = 'Great job! You have passed the quiz. Keep up the good work!';
    }
    await this.quizModel.updateOne(
      { module_id: moduleId, userId: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          user_answers: userAnswers,
          score,
          feedback: feedbackMessage,
          evaluated_at: new Date(),
        },
      }
    );
  
    return {
      score,
      feedback: feedbackMessage,
      incorrectAnswers,
    };
  }
}