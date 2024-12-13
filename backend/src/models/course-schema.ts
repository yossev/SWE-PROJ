import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop({ type: String, required: true, minlength: 3, maxlength: 100 })
  title: string;

  @Prop({ type: String, required: true, minlength: 10, maxlength: 10000 })
  description: string;

  @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
  category: string;

  @Prop({ type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';

  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  created_by: mongoose.Types.ObjectId;

  @Prop({ type: Date, default: () => new Date(), required: true })
  created_at: Date;

  @Prop({ type: [String], default: [] })
  versions: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  instructor: mongoose.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  students: mongoose.Types.ObjectId[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.index({ title: 'text', description: 'text' });
