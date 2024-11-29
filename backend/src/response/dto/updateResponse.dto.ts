import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
export class UpdateResponseDto {
  @IsMongoId()
  @IsOptional()
  user_id?: string; 

  @IsMongoId()
  @IsOptional()
  quiz_id?: string; 

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  answers?: Array<{
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
