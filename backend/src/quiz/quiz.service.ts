import { Injectable ,UnauthorizedException,BadRequestException, HttpStatus, HttpException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument } from '../../models/quizzes-schema';
import { Module } from '../../models/module-schema';
import { QuestionBank } from '../../models/questionbank-schema';
import {ProgressDocument} from '../../models/progress-schema';
import { CreateQuizDto } from './DTO/quiz.create.dto';
import { UpdateQuizDto } from './DTO/quiz.update.dto';
import { User ,UserSchema } from '../../models/user-schema';
import { QuestionType, DifficultyLevel } from './DTO/quiz.question.dto'; 
import { UserModule} from '../user/user/user.module';
import { Responses, ResponsesDocument } from '../../models/responses-schema'; 
import {ProgressService} from '../progress/progress.service'

import mongoose from 'mongoose';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<QuizDocument>,
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Progress') private readonly progressModel: Model<ProgressDocument>,
    @InjectModel('Responses') private readonly responsesModel: Model<ResponsesDocument>,

    private readonly progressService: ProgressService

  ) {}

  async findAll(): Promise<Quiz[]> {
    return await this.quizModel.find();
  }

  async findById(id: string): Promise<Quiz> {
    const inpStr: string= id;
    const objectId = new mongoose.Types.ObjectId(inpStr);  
    return await this.quizModel.findById(objectId).exec();
}
async findByUserId(userId: string): Promise<any> {
  console.log('Querying quiz for userId:', userId);

  const objectId = new mongoose.Types.ObjectId(userId);

  const quiz = await this.quizModel.findOne({ userId: objectId }).exec();

  if (!quiz) {
    throw new Error('No quiz found for the provided user ID.');
  }

  // Extract question ids and pass them along with the questions
  const questionIds = quiz.question_ids;
  const questions = await this.questionBankModel.find({
    _id: { $in: questionIds },
  });

  const responseQuiz = {
    quizId: quiz._id,
    questions: questions.map((q: any) => ({
      questionId: q._id.toString(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      explanation: q.explanation, 
    })),
    questionIds: questionIds, // Include the question ids
  };

  return responseQuiz;
}


async update(quizId: string, updateData: UpdateQuizDto, userId: string): Promise<Quiz> {
  // Check if the quiz exists
  const quiz = await this.quizModel.findById(quizId);
  if (!quiz) {
    throw new BadRequestException('Quiz not found.');
  }

  // Check if there are responses for this quiz (should happen before any update logic)
  const responsesExist = await this.responsesModel.findOne({ quiz_id: quizId });
  if (responsesExist) {
    throw new UnauthorizedException('This quiz has already been taken by a student and cannot be edited.');
  }

  // Proceed with the update only if no responses exist
  quiz.questionType = updateData.questionType || quiz.questionType;
  quiz.numberOfQuestions = updateData.numberOfQuestions || quiz.numberOfQuestions;

  // Validate required fields
  if (!quiz.questionType || !quiz.numberOfQuestions) {
    throw new BadRequestException('numberOfQuestions and questionType are required fields.');
  }

  // Fetch all questions from the QuestionBank
  const allQuestions = await this.questionBankModel.find();

  // Define the filter for selecting questions based on the provided questionType
  let difficultyLevels: string[] = [];
  if (quiz.questionType === QuestionType.MCQ) {
    difficultyLevels = ['Easy', 'Medium', 'Hard'];
  } else if (quiz.questionType === QuestionType.TrueFalse) {
    difficultyLevels = ['Easy', 'Medium'];
  }

  let questionFilter: any = {
    module_id: quiz.module_id,
    difficulty_level: { $in: difficultyLevels },
  };

  if (quiz.questionType === QuestionType.MCQ) {
    questionFilter.question_type = 'MCQ';
  } else if (quiz.questionType === QuestionType.TrueFalse) {
    questionFilter.question_type = 'True/False';
  } else {
    questionFilter.question_type = { $in: ['MCQ', 'True/False'] };
  }

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesType =
      (quiz.questionType === QuestionType.MCQ && q.question_type === 'MCQ') ||
      (quiz.questionType === QuestionType.TrueFalse && q.question_type === 'True/False') ||
      (quiz.questionType === QuestionType.Both && ['MCQ', 'True/False'].includes(q.question_type));

    const matchesModule = q.module_id.toString() === quiz.module_id.toString();

    return matchesType && matchesModule;
  });

  if (filteredQuestions.length < quiz.numberOfQuestions) {
    throw new BadRequestException('Not enough questions to satisfy the quiz requirements.');
  }

  // Randomly select questions
  const selectedQuestions = this.getRandomQuestions(filteredQuestions, quiz.numberOfQuestions);

  quiz.questions = selectedQuestions.map((q) => ({
    questionId: q._id,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
    difficultyLevel: q.difficulty_level,
  }));

  quiz.question_ids = selectedQuestions.map((q) => q._id);

  // Save the updated quiz
  await quiz.save();
  return quiz;
}

async delete(id: string): Promise<Quiz> {
  const objectId = new mongoose.Types.ObjectId(id); 
  console.log('Quiz ID to delete:', objectId);

  // Check if there are responses for this quiz (should happen before any deletion logic)
  const responsesExist = await this.responsesModel.findOne({ quiz_id: objectId });
  
  if (responsesExist) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  //await this.responsesModel.deleteMany({ quiz_id: objectId });
  const deletedQuiz = await this.quizModel.findByIdAndDelete(objectId);
  if (!deletedQuiz) {
    throw new BadRequestException('Quiz not found.');
  }

  return deletedQuiz;
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
    questionId: q._id.toString(),
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
    question_ids: extractedQuestionIds,
    questions: transformedQuestions,
    created_at: new Date(),
    userId: new mongoose.Types.ObjectId(userId),
    numberOfQuestions: numberOfQuestions, // Include this
    questionType: questionType, // Include this
  };
  console.log("Quiz Object Before Save:", quiz);

  

  const savedQuiz = await new this.quizModel(quiz).save();
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


  private calculateScore(
    answers: { questionId: mongoose.Types.ObjectId; answer: string }[],
    selectedQuestions: { questionId: string; correctAnswer: string }[],
  ): number {
    let correctAnswersCount = 0;
  
    // Compare user answers with the correct answers
    answers.forEach((answerObj) => {
      const matchedQuestion = selectedQuestions.find(
        (q) => q.questionId === answerObj.questionId.toString(),
      );
  
      if (matchedQuestion && matchedQuestion.correctAnswer === answerObj.answer) {
        correctAnswersCount++;
      }
    });
  
    // Calculate score as a percentage
    const score = (correctAnswersCount / selectedQuestions.length) * 100;
  
    return score;
  }
  

  async evaluateQuiz(
    userAnswers: string[], 
    selectedQuestions: { questionId: string }[], 
    userId: string, 
    quizId: string
): Promise<any> {
    const questionIds = selectedQuestions.map((q) => q.questionId);
    const objectIds = questionIds.map((id) => new mongoose.Types.ObjectId(id));

    // Fetch correct answers using the questionIds
    const questionsFromDB = await this.questionBankModel.find({
        _id: { $in: objectIds },
    }).select('correct_answer explanation');

    const answers = selectedQuestions.map((question, index) => {
        const correctAnswer = questionsFromDB.find(
            (q) => q._id.toString() === question.questionId
        )?.correct_answer;

        const explanation = questionsFromDB.find(
            (q) => q._id.toString() === question.questionId
        )?.explanation;

        // Compare answers (trim whitespace and standardize case)
        const userAnswer = userAnswers[index]?.trim().toLowerCase();
        const correctAnswerTrimmed = correctAnswer?.trim().toLowerCase();

        return {
            questionId: new mongoose.Types.ObjectId(question.questionId),
            answer: userAnswer || '',
            correctAnswer: correctAnswer || 'Not available',
            explanation: explanation || 'No explanation available',
            isCorrect: userAnswer === correctAnswerTrimmed // Flag if answer is correct
        };
    });

    const correctAnswersCount = answers.filter(a => a.isCorrect).length;

    const score = (correctAnswersCount / selectedQuestions.length) * 100;

    // Save responses
    const responseDocument = new this.responsesModel({
        user_id: new mongoose.Types.ObjectId(userId),
        quiz_id: new mongoose.Types.ObjectId(quizId),
        answers,
        correctAnswers: answers.filter(a => a.isCorrect),
        incorrectAnswers: answers.filter(a => !a.isCorrect),
        score,
        submittedAt: new Date(),
    });

    await responseDocument.save();

    return { 
        score, 
        feedback: score >= 50 ? 'Good job!, you are ready for the next module!' : 'Needs improvement, please re-study the module again',
        correctAnswers: answers.filter(a => a.isCorrect),
        incorrectAnswers: answers.filter(a => !a.isCorrect)
    };
}
async getresponsestotal(id: string): Promise<any> {
  const objectId = new mongoose.Types.ObjectId(id);
  const responses = await this.responsesModel.find({ quiz_id: objectId });
  return responses.length;
}
}
  
