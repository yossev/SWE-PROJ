/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { title } from 'process';
  
export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  // eslint-disable-next-line prettier/prettier
  @Prop({ type: String, required: true, minLength: 3, maxLength: 100 })
  title: string;

  @Prop({ type: String, required: true, minLength: 10, maxLength: 10000 })
  description: string;

  @Prop({ type: String, required: true, minLength: 2, maxLength: 50 })
  category: string;

  @Prop({
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';

  @Prop({ type: String, required: true, minLength: 20, maxLength: 500 })
  created_by: string;

  @Prop({ type: Date, default: new Date(), required: true })
  created_at: Date;

  @Prop({type: [String], default: []}) // Possible Changes here, Default can be 1s
  versions: string[]; 
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// 
CourseSchema.index({ title: 'text', description: 'text' });