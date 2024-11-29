import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
export class CreateResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: mongoose.Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  quiz_id: mongoose.Types.ObjectId;

  @IsArray()
  @IsNotEmpty()
  answers: Array<{
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
