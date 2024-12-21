import { IsOptional, IsEnum, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './quiz.question.dto';
import { QuestionDto } from './quiz.question.dto';

export class UpdateQuizDto {

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNumber()
  @Min(1)
  numberOfQuestions: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}
