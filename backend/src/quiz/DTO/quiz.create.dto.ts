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
  @IsNotEmpty()
  @IsNumber()
  numberOfQuestions: number; 

  @IsArray()
  @IsOptional()
  @Type(() => QuestionDto)
  questions: QuestionDto[]; 
}
