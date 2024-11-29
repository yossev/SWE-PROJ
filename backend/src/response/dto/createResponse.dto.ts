import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
export class CreateResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsMongoId()
  @IsNotEmpty()
  quiz_id: string;

  @IsArray()
  @IsNotEmpty()
  answers: Array<{
    questionId: string;
    answer: string;
  }>;

  @IsNumber()
  @Min(0)
  @IsOptional()
  score?: number;

  @IsDate()
  @IsOptional()
  submittedAt?: Date;
}
