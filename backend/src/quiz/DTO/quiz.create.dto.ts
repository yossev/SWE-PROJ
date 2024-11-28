import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from './quiz.question.dto';
import { QuestionDto } from './quiz.question.dto';
export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsEnum(QuestionType)
  questionType: QuestionType;

  @IsNumber()
  @Min(1)
  numberOfQuestions: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
