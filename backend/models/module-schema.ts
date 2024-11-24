import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
  })
@Schema()
export class Module extends Document {
  @Prop({ type: String, required: true, unique: true, minlength: 1 })
  module_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
  course_id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true, minlength: 1, maxlength: 100 })
  title: string;

  @Prop({ type: String, required: true, minlength: 1, maxlength: 5000 })
  content: string;

  @Prop({ type: [String], required: false })
  resources: string[];

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
