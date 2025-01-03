import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module extends Document {

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
