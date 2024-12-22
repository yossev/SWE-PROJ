/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import{ Module} from '../models/module-schema';
import mongoose, { Model, Types } from 'mongoose';
import { CourseDocument } from '../models/course-schema';
import { ProgressDocument } from '../models/progress-schema';
import { QuestionBank } from '../models/questionbank-schema';
import { QuizDocument, Quiz } from '../models/quizzes-schema';
import { ResponsesDocument } from '../models/responses-schema';
import { User } from '../models/user-schema';

import { NotificationService } from 'src/notification/notification.service';
import { ProgressService } from 'src/progress/progress.service';
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { DifficultyLevel, QuestionType } from './DTO/quiz.question.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDocument>,
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Progress') private readonly progressModel: Model<ProgressDocument>,
    @InjectModel('Responses') private readonly responsesModel: Model<ResponsesDocument>,
    @InjectModel('Course') private readonly courseModel: Model<CourseDocument>,

    private readonly progressService: ProgressService,
    private readonly notificationService: NotificationService

  ) {}

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.find();
  }

  async findById(id: string): Promise<Quiz> {
    const inpStr: string= id;
    const objectId = new mongoose.Types.ObjectId(inpStr);  
    return await this.quizModel.findById(objectId).exec();
}
async findByUserId(userId: string): Promise<Quiz> {
  console.log('Querying quiz for userId:', userId);

  const objectId = new mongoose.Types.ObjectId(userId);


  const quiz = await this.quizModel.findOne({ userId: objectId }).exec();

  return quiz;
}


async update(@Req() req, id: string, updateData: UpdateQuizDto): Promise<Quiz> {
  const userId = req.cookies.userId;
  const quiz=await this.quizModel.findById(id).exec();
  const module=await this.moduleModel.findOne({module_id:quiz.module_id});
  const instructor=(await this.courseModel.findOne({course_id:module.course_id})).instructor;
  if(instructor.toString()!==userId)
  {
    throw new UnauthorizedException("You are not authorized to update this quiz");
  }
  const inpStr: string= id;
  const objectId = new mongoose.Types.ObjectId(inpStr);  
  return await this.quizModel.findByIdAndUpdate(objectId, updateData, { new: true }).exec();
}


async delete(@Req() req,id: string): Promise<Quiz> {
  const userId = req.cookies.userId;
  const quiz=await this.quizModel.findById(id).exec();
  const module=await this.moduleModel.findOne({module_id:quiz.module_id});
  const instructor=(await this.courseModel.findOne({course_id:module.course_id})).instructor;
  if(instructor.toString()!==userId)
  {
    throw new UnauthorizedException("You are not authorized to update this quiz");
  }
  const inpStr: string= id;
  const objectId = new mongoose.Types.ObjectId(inpStr);  
  return await this.quizModel.findByIdAndDelete(objectId).exec();
}

// DONT TOUCH THIS VODOO ( IT WORKS AND IDK HOW )
async generateQuiz(createQuizDto: CreateQuizDto, userId: string): Promise<any> {
  const { moduleId, numberOfQuestions, questionType ,questionIds} = createQuizDto;
  createQuizDto['user_id'] = userId;
  const allQuestions = await this.questionBankModel.find();
  //console.log('All Questions from Question Bank:', allQuestions);

  
  const performanceMetric = await this.progressService.classifyUserPerformance(userId)


  let difficultyLevels: string[];
  if (performanceMetric === 'Above Average') {
    difficultyLevels = [DifficultyLevel.Medium, DifficultyLevel.Hard];
  } else if (performanceMetric === 'Average') {
    difficultyLevels = [DifficultyLevel.Easy, DifficultyLevel.Medium];
  } else if(performanceMetric === 'Below Average'){
    difficultyLevels = [DifficultyLevel.Easy];
  } else {
    difficultyLevels = [DifficultyLevel.Hard]
   }

  console.log('Input Filter Conditions:', {
    moduleId,
    difficultyLevels,
    questionType,
  });

  const questionFilter: any = {
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
    questionId: q._id,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    difficultyLevel: q.difficulty_level,
  }));
  console.log("trans questions",transformedQuestions)
  const extractedQuestionIds : Types.ObjectId[]  = [];
  transformedQuestions.forEach(function(value) {
    extractedQuestionIds.push(new Types.ObjectId(value.questionId))
  })
  console.log("Extracted: " + extractedQuestionIds);
  const quiz = {
    module_id: moduleId,
    question_ids: extractedQuestionIds , 
    questions: transformedQuestions,
    created_at: new Date(),
    userId: new mongoose.Types.ObjectId(userId), 
  };
  
  const savedQuiz = await new this.quizModel(quiz).save();

  this.notificationService.createNotification(new Types.ObjectId(userId), 'New quiz has been generated for you.', savedQuiz._id.toString());
  console.log('Saved Quiz:', savedQuiz);
  await this.userModel.findByIdAndUpdate(
    userId,
    { $push: { quizzes: savedQuiz._id } },
    { new: true }
  );

  const responseQuestions = selectedQuestions.map((q) => ({
    question: q.question,
    options: q.options,
    questionId: q._id,
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
    quizId: string, // Add quizId parameter
  ): Promise<any> {
    let correctAnswersCount = 0;
    const incorrectAnswers = [];
  
    // Fetch correct answers using question IDs
    const question_ids = selectedQuestions.map((q) => q.questionId);
    const fetchedQuestions = await this.questionBankModel.find({ _id: { $in: question_ids } });
  
    const questionMap = fetchedQuestions.reduce((map, question) => {
      map[question._id.toString()] = question.correct_answer;
      return map;
    }, {});
  
    const answersToSave = [];
    selectedQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = questionMap[question.questionId];
  
      answersToSave.push({
        questionId: question.questionId,
        answer: userAnswer,
      });
  
      if (userAnswer === correctAnswer) {
        correctAnswersCount++;
      } else {
        incorrectAnswers.push({
          question: question.question,
          correctAnswer: correctAnswer || "N/A",
          userAnswer: userAnswer || "N/A",
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
  
    // Save the results in the Responses schema
    const responseDocument = new this.responsesModel({
      user_id: new mongoose.Types.ObjectId(userId),
      quiz_id: quizId, // Use quizId passed from Postman
      answers: answersToSave,
      score,
      submittedAt: new Date(),
    });
  
    await responseDocument.save();
  
    return {
      score,
      feedback: feedbackMessage,
      incorrectAnswers,
    };
  }
}
  
  
  

