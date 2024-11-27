import { IsNotEmpty, IsString, IsNumber, Min, Max, IsOptional, IsMongoId } from 'class-validator';
export class UpdateProgressDTO {

  @IsMongoId()
  @IsNotEmpty()
  user_id: string; 

  @IsMongoId()
  @IsNotEmpty()
  course_id: string; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  completion_percentage?: number; 

  @IsOptional()
  @IsString()
  last_accessed?: string; 
}
