/* eslint-disable prettier/prettier */
import { IsMongoId, IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReplyDto {
  @IsMongoId()
  @IsNotEmpty()
  threadId?: Types.ObjectId;; // The ID of the thread to which the reply belongs

  @IsString()
  @IsNotEmpty()
  content: string; // The content of the reply

  @IsMongoId()
  @IsNotEmpty()
  createdBy: string; // The user who created the reply
}
