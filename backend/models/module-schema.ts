import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: mongoose.Schema.Types.ObjectId; // Reference to the course this module belongs to

  @Prop({ type: String, required: true, minlength: 1, maxlength: 100 })
  title: string; // Title of the module

  @Prop({ type: String, required: true, minlength: 1, maxlength: 5000 })
  content: string; // Content of the module

  @Prop({ type: [String], required: false })
  resources: string[]; // Resources related to the module

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionBank', required: true })
  question_bank_id: mongoose.Schema.Types.ObjectId; // Reference to the QuestionBank

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }], default: [] })
  quizzes: mongoose.Schema.Types.ObjectId[]; // References to quizzes related to the module

  @Prop({ type: String, enum: ['MCQ', 'TrueFalse', 'Both'], default: 'Both' })
  question_type: string; // Type of questions (MCQ, TrueFalse, or Both)

  @Prop({ type: Boolean, default: true })
  shuffle_questions: boolean; // Whether to shuffle the questions or not

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' })
  instructor_id: mongoose.Schema.Types.ObjectId; // Reference to the instructor who created the module

  @Prop({ type: Date, default: Date.now })
  created_at: Date; // Timestamp when the module was created
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
