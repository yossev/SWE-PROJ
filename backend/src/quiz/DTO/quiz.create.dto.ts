import { IsString, IsArray, IsNotEmpty, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, DifficultyLevel } from './quiz.question.dto'; 
import { QuestionDto } from './quiz.question.dto'; 
export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string; 

  @IsEnum(QuestionType)
  questionType: QuestionType; 

  @IsArray()
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];

  @IsNotEmpty()
  @IsNumber()
  numberOfQuestions: number; 

  @IsString()
  @IsNotEmpty()
  userId: string; 

  @IsArray()
  @IsOptional()
  @IsString({ each: true }) // Ensure every element in the array is a string
  questionIds?: string[]; 

}