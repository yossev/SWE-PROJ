import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;

@Schema()
export class Quiz {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
  module_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, enum: ['MCQ', 'TrueFalse', 'Both'] })
  question_type: string;

  @Prop({ type: Number, required: true }) // Number of questions for the quiz
  number_of_questions: number;

  @Prop({
    type: [
      {
        question: { type: mongoose.Schema.Types.Mixed, required: true },
        options: { type: [mongoose.Schema.Types.Mixed], required: true },
        correct_answer: { type: mongoose.Schema.Types.Mixed, required: true },
        difficulty_level: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
        explanation: { type: String, required: false },
      },
    ],
    required: true,
  })
  questions: Array<{
    question: string | number;
    options: (string | number)[];
    correct_answer: string | number;
    difficulty_level: 'Easy' | 'Medium' | 'Hard';
    explanation?: string;
  }>;

  @Prop({ type: Date, default: new Date(), required: true })
  created_at: Date;

  @Prop({ type: Boolean, default: false })
  is_feedback_provided: boolean;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
