/* eslint-disable prettier/prettier */
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class DeleteRoomDto {
  @IsMongoId()
  roomId: Types.ObjectId; // Room ID to be deleted
}
