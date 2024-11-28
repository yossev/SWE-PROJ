import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { Module } from '../../models/module-schema'; // Import the Module schema
import { QuestionBank } from '../../models/questionbank-schema';
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,  // Inject Quiz model
    @InjectModel('Module') private readonly moduleModel: Model<Module>, // Inject Module model
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
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

  // This is the method where the error occurs. We need to ensure moduleModel is injected.
  async generateQuiz(moduleId: string, userAnswers: string[]): Promise<any> {
    // Fetch the module to get its question type (MCQ, TrueFalse, or Both)
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new Error('Module not found.');
    }
  
    // Fetch questions from the QuestionBank based on the module_id
    const easyQuestions = await this.questionBankModel.find({ 
      module_id: moduleId, 
      difficulty_level: 'Easy' 
    });
    
    const mediumQuestions = await this.questionBankModel.find({ 
      module_id: moduleId, 
      difficulty_level: 'Medium' 
    });
    
    const hardQuestions = await this.questionBankModel.find({ 
      module_id: moduleId, 
      difficulty_level: 'Hard' 
    });
  
    if (!easyQuestions.length || !mediumQuestions.length || !hardQuestions.length) {
      throw new Error('Not enough questions in the question bank.');
    }
  
    let correctAnswers = 0;
    let totalQuestions = 0;
    let currentDifficulty = 'Easy';
    let feedback = [];
  
    // Store incorrect questions for final feedback
    let incorrectQuestions = [];
  
    // Start with Easy questions
    let selectedQuestions = easyQuestions;
    let currentIndex = 0;
  
    // Track user's answers
    for (let i = 0; i < 12; i++) {
      const currentQuestion = selectedQuestions[currentIndex];
  
      if (!currentQuestion) break;
  
      const userAnswer = userAnswers[i];
  
      // Check if the answer is correct
      if (userAnswer === currentQuestion.correct_answer) {
        correctAnswers++;
      } else {
        // Store incorrect questions for feedback
        incorrectQuestions.push({
          question: currentQuestion.question,
          correctAnswer: currentQuestion.correct_answer,
          explanation: currentQuestion.explanation,
        });
      }
  
      totalQuestions++;
  
      // Update difficulty level based on correct answers
      if (correctAnswers >= 4 && currentDifficulty === 'Easy') {
        currentDifficulty = 'Medium';  // Move to Medium difficulty
        selectedQuestions = mediumQuestions;
        currentIndex = Math.floor(Math.random() * mediumQuestions.length);  // Randomly select from medium questions
      } else if (correctAnswers >= 8 && currentDifficulty === 'Medium') {
        currentDifficulty = 'Hard';  // Move to Hard difficulty
        selectedQuestions = hardQuestions;
        currentIndex = Math.floor(Math.random() * hardQuestions.length);  // Randomly select from hard questions
      }
  
      // If there are no more questions in the current difficulty level, end the quiz
      if (totalQuestions === 12) break;
    }
  
    // Prepare the list of questions with options (for MCQ and True/False)
    const questionDetails = selectedQuestions.map(question => ({
      question: question.question,
      options: question.options, // Options provided by the instructor
      correctAnswer: question.correct_answer, // Correct answer
    }));
  
    // Calculate score
    const score = (correctAnswers / totalQuestions) * 100;
  
    // Prepare feedback message
    const resultFeedback = incorrectQuestions.length
      ? `You need to work on the following topics: ${incorrectQuestions
          .map((item) => item.explanation)
          .join(', ')}.`
      : 'Good job! Keep up the great work.';
  
    // Push all incorrect questions to the feedback
    feedback = feedback.concat(incorrectQuestions);
  
    return {
      score,
      feedback: resultFeedback,
      questions: questionDetails, // Return the questions along with options
    };
  }
  
}
