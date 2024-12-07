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

// DONT TOUCH THIS VODOO ( IT WORKS AND IDK HOW )
async generateQuiz(createQuizDto: CreateQuizDto, performanceMetric: string, userId: string): Promise<any> {
  const { moduleId, numberOfQuestions, questionType } = createQuizDto;
  const allQuestions = await this.questionBankModel.find();
  //console.log('All Questions from Question Bank:', allQuestions);
  performanceMetric = "Average";


  let difficultyLevels: string[];
  if (performanceMetric === 'Above Average') {
    difficultyLevels = [DifficultyLevel.Medium, DifficultyLevel.Hard];
  } else if (performanceMetric === 'Average') {
    difficultyLevels = [DifficultyLevel.Easy, DifficultyLevel.Medium];
  } else {
    difficultyLevels = [DifficultyLevel.Easy];
  }

  console.log('Input Filter Conditions:', {
    moduleId,
    difficultyLevels,
    questionType,
  });

  let questionFilter: any = {
    module_id: moduleId,
    difficulty_level: { $in: difficultyLevels },
  };

  console.log('Question Type from DTO:', questionType);
  if (questionType === QuestionType.MCQ) {
    questionFilter.question_type = 'MCQ';
  } else if (questionType === QuestionType.TrueFalse) {
    questionFilter.question_type = 'True/False';
  } else {
    questionFilter.question_type = { $in: ['MCQ', 'True/False'] };
  }

  const questions = allQuestions.filter((q) => {
    console.log('Filtering question:', q);
    console.log('Question type from DB:', q.question_type);
    console.log('Question Filter Type:', questionFilter.question_type);

    
    const matchesType = 
    (questionFilter.question_type?.$in?.includes(q.question_type)) || 
    questionFilter.question_type === q.question_type;

  
    console.log('Matches type:', matchesType);
  

    const matchesDifficulty = difficultyLevels.includes(q.difficulty_level);
    console.log('Matches difficulty:', matchesDifficulty);

    const isModuleMatch = q.module_id.toString() === moduleId.toString();
    console.log('Module ID matches:', isModuleMatch);
  
    return (
      isModuleMatch &&
      matchesDifficulty &&
      matchesType
    );
  });

  console.log('Filtered Questions:', questions);


  if (questions.length === 0) {
    console.log('No questions matched the filter conditions.');
  }


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
    userId: new mongoose.Types.ObjectId(userId), 
  };

  const savedQuiz = await new this.quizModel(quiz).save();
  console.log('Saved Quiz:', savedQuiz);

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

private shuffleArray(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
  }
  return array;
}


  private getRandomQuestions(questions: any[], count: number): any[] {
    console.log("Number of Questions Selected:", count);
    console.log("Total Available Questions:", questions.length);

    const validCount = Math.min(count, questions.length);
    console.log("Valid Count for Selection:", validCount);
    
    return this.shuffleArray(questions).slice(0, validCount);    

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