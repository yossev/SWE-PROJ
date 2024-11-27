import { IsString, IsArray, IsNotEmpty, IsEnum, IsNumber, Min, ValidateNested } from 'class-validator'; 
import { Type } from 'class-transformer';

// Enum for Question Type
enum QuestionType {
  MCQ = 'MCQ',
  TrueFalse = 'TrueFalse',
  Both = 'Both'
}

export class CreateQuizDto {
  
  @IsString()
  @IsNotEmpty()
  moduleId: string;  // Link to the Module

  @IsEnum(QuestionType)  // Use enum for stronger type validation
  questionType: QuestionType;  

  @IsNumber()
  numberOfQuestions: number;  

  @IsArray()
  @IsNotEmpty()
  @Type(() => Object)
  questions: Array<{
    question: string | number;  // The question can be a string or a number
    options: (string | number)[];  // The options can be an array of strings or numbers
    correctAnswer: string | number;  // The correct answer can be a string or a number
    difficultyLevel: 'Easy' | 'Medium' | 'Hard';  // The difficulty level can be 'Easy', 'Medium', or 'Hard'
  }>;

}