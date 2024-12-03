/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
// group chat
@Schema()
export class Message extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  message_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string; // Content of the message

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'room' })
    roomId: mongoose.Types.ObjectId;// Chat room ID (optional, if needed for group chats)

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Timestamp when the message was sent
}

export const MessageSchema = SchemaFactory.createForClass(Message);