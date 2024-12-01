/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema()
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Reference to the user receiving the notification

  @Prop({ type: String, required: true })
  message: string; // alert

  @Prop({ type: Boolean, default: false })
  read: boolean; // Status of the notification (read/unread)

  @Prop({ type: Types.ObjectId, ref: 'Message', required: false })
  relatedMessageId?: Types.ObjectId; // Reference to the related message (optional)

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Timestamp when the notification was created
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
