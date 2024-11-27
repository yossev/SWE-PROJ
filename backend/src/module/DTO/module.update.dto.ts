import { IsString, IsArray, IsOptional, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

enum QuestionType {
  MCQ = 'MCQ',
  TrueFalse = 'TrueFalse',
  Both = 'Both'
}
export class UpdateQuizDto {
  
  @IsOptional()
  @IsEnum(QuestionType)  // Ensure the questionType is valid if provided
  questionType?: QuestionType;

  @IsOptional()
  @IsNumber()
  numberOfQuestions?: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @Type(() => Object)
  questions?: Array<{
    question: string | number;
    options: (string | number)[];
    correctAnswer: string | number;
    difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  }>;

}