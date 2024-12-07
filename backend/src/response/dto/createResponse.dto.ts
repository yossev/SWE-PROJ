import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateResponseDto {

  user_id: string;

  quiz_id: string;

  answers: Array<{
    questionId: string;
    answer: string;
  }>;

  score?: number;

  submittedAt?: Date;
}
