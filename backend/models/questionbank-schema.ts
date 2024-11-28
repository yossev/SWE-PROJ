import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type QuestionBankDocument = Document & QuestionBank;

@Schema()
export class QuestionBank {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  module_id: mongoose.Schema.Types.ObjectId; // Associate the question bank with a specific module

  @Prop({ required: true })
  question: string; // The question text

  @Prop({ type: [String], required: true })
  options: string[]; // The answer options for the question

  @Prop({ required: true })
  correct_answer: string; // The correct answer for the question

  @Prop({ enum: ['Easy', 'Medium', 'Hard'], required: true })
  difficulty_level: string; // The difficulty level of the question

  @Prop({ required: false })
  explanation?: string; // Explanation for the question (optional)
}

export const QuestionBankSchema = SchemaFactory.createForClass(QuestionBank);
