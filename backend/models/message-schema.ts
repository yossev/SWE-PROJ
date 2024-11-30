import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// group chat
@Schema()
export class Message extends Document {
  @Prop({ type: String, required: true })
  userId: string; // ID of the user sending the message

  @Prop({ type: String, required: true })
  content: string; // Content of the message

  @Prop({ type: String, required: true })
  roomId: string; // Chat room ID (optional, if needed for group chats)

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Timestamp when the message was sent
}

export const MessageSchema = SchemaFactory.createForClass(Message);