import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
export class UpdateResponseDto {
  user_id?: string; 

  quiz_id?: string; 

  answers?: Array<{
    questionId: string; 
    answer: string;
  }>;

  score?: number;
  
  submittedAt?: Date;
}
