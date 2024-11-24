import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>;
const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
  })

@Schema()
export class Quiz {

  @Prop({ type: String, required: true })
  module_id: string;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true }, 
        correct_answer: { type: String, required: true }, 
      },
    ],
    required: true,
  })
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: string;
  }>;

  @Prop({ type: Date, default: new Date(), required: true })
  created_at: Date;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
