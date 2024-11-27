import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: mongoose.Schema.Types.ObjectId;  

  @Prop({ type: String, required: true, minlength: 1, maxlength: 100 })
  title: string;  
  @Prop({ type: String, required: true, minlength: 1, maxlength: 5000 })
  content: string;  

  @Prop({ type: [String], required: false })
  resources: string[]; 

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }], default: [] })
  quizzes: mongoose.Schema.Types.ObjectId[];  

  @Prop({ type: [{ question: { type: String }, options: [String], correct_answer: String }], default: [] })
  question_bank: { question: string, options: string[], correct_answer: string }[];  

  @Prop({ type: String, enum: ['MCQ', 'TrueFalse', 'Both'], default: 'Both' })
  question_type: string; 

  @Prop({ type: Boolean, default: true })
  shuffle_questions: boolean;  

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' })
  instructor_id: mongoose.Schema.Types.ObjectId;  

  @Prop({ type: Date, default: Date.now })
  created_at: Date;  
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
