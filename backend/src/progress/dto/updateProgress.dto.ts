import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateProgressDTO {
  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  user_id?: mongoose.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  course_id?: mongoose.Types.ObjectId; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completion_percentage?: number; 

  @IsOptional()
  @IsString()
  last_accessed?: string; 
  
}
