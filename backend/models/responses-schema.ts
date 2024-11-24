import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose,{ HydratedDocument } from 'mongoose';

export type ResponseDocument = HydratedDocument<Response>;
const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
  })
@Schema({ timestamps: true, strict: false })
export class Response {
  @Prop({ type: String, unique: true, required: true })
  responseId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  quizId: string;

  @Prop({
    type: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    required: true,
  })
  answers: { questionId: string; answer: string }[];

  @Prop({ type: Number, min: 0 })
  score: number;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;
}

// Create the schema factory for the Response class
export const ResponseSchema = SchemaFactory.createForClass(Response);
