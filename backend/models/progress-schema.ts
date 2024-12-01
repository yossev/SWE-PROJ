import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type ProgressDocument = HydratedDocument<Progress>;

@Schema()

export class Progress {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, max: 100 })
  completion_percentage: number;

  @Prop({ type: Date, default: () => new Date(), required: true })
  last_accessed: Date;

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

