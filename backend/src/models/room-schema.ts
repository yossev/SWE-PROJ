/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema()
export class Room {
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true })
  user_id: Types.ObjectId[]; // List of users in the room

  // Unique identifier for the room
  @Prop({ type: Boolean, required: true })
  room_status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: Types.ObjectId; // Reference to the related course
}

export const RoomSchema = SchemaFactory.createForClass(Room);
