/* eslint-disable prettier/prettier */
import { IsMongoId, IsString, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';

export class CreateForumDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: Types.ObjectId; // Reference to the associated course (use ObjectId)

  @IsString()
  @IsNotEmpty()
  forumTitle: string; // Title of the forum

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string; // Reference to the user who created the forum (use ObjectId)

  @IsArray()
  threads: string[]; // Array of thread references (use ObjectIds for the threads in the forum)

  @IsBoolean()
  active: boolean;
  
}
