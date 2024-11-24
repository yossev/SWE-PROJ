import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type CourseDocument = HydratedDocument<Progress>;

const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
  })
  
@Schema()

export class Progress { 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: mongoose.Schema.Types.ObjectId; 

  @Prop({ type: String, required: true, minLength: 0, maxLength: 100 })
  completion_percentage: Number;

  @Prop({ type: Date, default: new Date(), required: true})
  last_accessed: Date;

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

