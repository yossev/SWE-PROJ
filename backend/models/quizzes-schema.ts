import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  module_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'QuestionBank', required: true })
  question_ids: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String, enum: ['MCQ', 'True/False', 'Both'], required: true })
  questionType?: string; 

  @Prop({ type: Number, min: 1, required: true })
  numberOfQuestions?: number; 
  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
      },
    ],
    required: true,
  })
  questions: Array<{
    question: string;
    options: string[];
  }>;

  @Prop({ type: Date, default: new Date(), required: true })
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
