/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Room {
  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users: Types.ObjectId[]; // List of users in the room

  @Prop({ type: String, required: true, unique: true })
  roomId: string; // Unique identifier for the room
  @Prop({ type: Boolean, required: true })
  room_status: boolean;
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId; // Reference to the related course
}

export const RoomSchema = SchemaFactory.createForClass(Room);
