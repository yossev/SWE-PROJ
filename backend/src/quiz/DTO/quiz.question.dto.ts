import { IsString, IsArray, IsNotEmpty, IsEnum } from 'class-validator';

export enum QuestionType {
    MCQ = 'MCQ',
    TrueFalse = 'TrueFalse',
    Both = 'Both',
  }
  
  // Enum for Difficulty Levels
  export enum DifficultyLevel {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
  }
  
  export class QuestionDto {
    @IsString()
    @IsNotEmpty()
    question: string; // The question text
  
    @IsArray()
    @IsNotEmpty()
    options: string[]; // Array of possible answers (e.g., for MCQs)
  
    @IsString()
    @IsNotEmpty()
    correctAnswer: string; // The correct answer for the question
  
    @IsEnum(DifficultyLevel)
    difficultyLevel: DifficultyLevel; // Difficulty level of the question
  }
  