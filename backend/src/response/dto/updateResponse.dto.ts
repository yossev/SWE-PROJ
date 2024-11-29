import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
export class UpdateResponseDto {
  @IsMongoId()
  @IsOptional()
  user_id?: mongoose.Types.ObjectId; 

  @IsMongoId()
  @IsOptional()
  quiz_id?: mongoose.Types.ObjectId; 

  @IsArray()
  @IsOptional()
  @IsNotEmpty({ each: true })
  answers?: Array<{
    questionId: mongoose.Types.ObjectId; 
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
