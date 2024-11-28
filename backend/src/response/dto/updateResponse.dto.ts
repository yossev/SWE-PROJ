import { Type } from 'class-transformer';
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import mongoose from 'mongoose';
import { ValidateNested } from 'class-validator';

export class UpdateResponseDto {
  @IsMongoId()
  @IsOptional()
  user_id?: mongoose.Types.ObjectId; 

  @IsMongoId()
  @IsOptional()
  quiz_id?: mongoose.Types.ObjectId; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAnswerDto)
  @IsOptional()
  answers?: Array<UpdateAnswerDto>; // Optional: Update answers partially or entirely

  @IsNumber()
  @Min(0)
  @IsOptional()
  score?: number; 

  @IsDate()
  @IsOptional()
  submittedAt?: Date; 
}

export class UpdateAnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  questionId: string; 

  @IsNotEmpty()
  answer: string; 
}