/* eslint-disable prettier/prettier */
import { IsString, IsArray, IsMongoId, ArrayNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  
  @IsMongoId()
  instructor: Types.ObjectId; // Reference to the instructor (User ID)

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  students: Types.ObjectId[]; // List of students (User IDs)

  @IsString()
  name: string; // Room name
}
