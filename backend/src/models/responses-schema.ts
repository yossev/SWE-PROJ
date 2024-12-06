/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose,{ HydratedDocument } from 'mongoose';

export type ResponseDocument = HydratedDocument<Response>;


@Schema({ timestamps: true, strict: false })
export class Response {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true })
  quiz_id: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: [
      {
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions', required: true }, // Reference to the question in the Quiz schema
        answer: { type: String, required: true }, // User's answer to the question
      },
    ],
    required: true,
  })
  answers: Array<{
    question_id: mongoose.Schema.Types.ObjectId; // Reference to a question in the Quiz schema
    answer: string; // User's answer to the question
  }>;

  @Prop({ type: Number, min: 0 })
  score: number;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;
}

// Create the schema factory for the Response class
export const ResponseSchema = SchemaFactory.createForClass(Response);
