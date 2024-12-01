import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../models/quizzes-schema';
import { Module } from '../../models/module-schema'; 
import { QuestionBank } from '../../models/questionbank-schema';
import { CreateModuleDto } from './DTO/createModule.dto';
import { UpdateModuleDto } from './DTO/updateModule.dto';
import { CreateQuizDto } from './DTO/module.create.dto';
import { UpdateQuizDto } from './DTO/module.update.dto';
import { UploadedFile } from '@nestjs/common';

import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    const oneKb = 1000;
    return value.size < oneKb;
  }
}


@Injectable()
export class ModuleService {
  constructor(
    @InjectModel('Quiz') private readonly quizModel: Model<Quiz>,  
    @InjectModel('Module') private readonly moduleModel: Model<Module>, 
    @InjectModel('QuestionBank') private readonly questionBankModel: Model<QuestionBank>,
  ) {}

  async createModule(createModuleDto : CreateModuleDto)
  {
    const createdModule = new this.moduleModel(createModuleDto);
    return createdModule.save();
  }

  async updateModule(id : string , updateModuleDto : UpdateModuleDto)
  {
    const module = await this.moduleModel.findById(id).exec();
    if(module)
    {
      Object.assign(module, updateModuleDto) // Update Course
        return module.save()
    }
    return null;
  }

  async checkModuleCompatibility(moduleId: string , performanceMetric : string)
  {
    var performanceLevel : String;
    if (performanceMetric === 'Above Average') {
      performanceLevel = 'Hard';
    } else if (performanceMetric === 'Average') {
      performanceLevel = 'Medium';
    } else {
      performanceLevel = 'East';
    }

    var moduleDifficulty : String = (await this.moduleModel.findById(moduleId).exec()).difficulty;
    switch(performanceLevel)
    {
      case 'Hard':
        return true;
      break;

      case 'Medium':
        if(moduleDifficulty === 'Hard')
        {
          return false;
        }
        else
        {
          return true;
        }
      break;

      case 'Easy':
        if(moduleDifficulty === 'Easy')
        {
          return true;
        }
        else
        {
          return false;
        }
    }

    return false;
  }

  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }

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

  
  async generateQuiz(moduleId: string, userAnswers: string[]): Promise<any> {
    const module = await this.moduleModel.findById(moduleId);
    if (!module) {
      throw new Error('Module not found.');
    }
  
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

    let incorrectQuestions = [];
  

    let selectedQuestions = easyQuestions;
    let currentIndex = 0;

    for (let i = 0; i < 12; i++) {
      const currentQuestion = selectedQuestions[currentIndex];
  
      if (!currentQuestion) break;
  
      const userAnswer = userAnswers[i];
  
     
      if (userAnswer === currentQuestion.correct_answer) {
        correctAnswers++;
      } else {
   
        incorrectQuestions.push({
          question: currentQuestion.question,
          correctAnswer: currentQuestion.correct_answer,
          explanation: currentQuestion.explanation,
        });
      }
  
      totalQuestions++;
  

      if (correctAnswers >= 4 && currentDifficulty === 'Easy') {
        currentDifficulty = 'Medium';  
        selectedQuestions = mediumQuestions;
        currentIndex = Math.floor(Math.random() * mediumQuestions.length); 
      } else if (correctAnswers >= 8 && currentDifficulty === 'Medium') {
        currentDifficulty = 'Hard'; 
        selectedQuestions = hardQuestions;
        currentIndex = Math.floor(Math.random() * hardQuestions.length); 
      }
  
     
      if (totalQuestions === 12) break;
    }
  
    const questionDetails = selectedQuestions.map(question => ({
      question: question.question,
      options: question.options, 
      correctAnswer: question.correct_answer, 
    }));
  
  
    const score = (correctAnswers / totalQuestions) * 100;
  

    const resultFeedback = incorrectQuestions.length
      ? `You need to work on the following topics: ${incorrectQuestions
          .map((item) => item.explanation)
          .join(', ')}.`
      : 'Good job! Keep up the great work.';
  
 
    feedback = feedback.concat(incorrectQuestions);
  
    return {
      score,
      feedback: resultFeedback,
      questions: questionDetails, 
    };
  }



  
}
