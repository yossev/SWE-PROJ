/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {  Schema as MongooseSchema } from 'mongoose';


export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic extends Document{
  @Prop({ required: true })
  topicTitle: string; // Title of the Topic (representing the topic)

  @Prop({ required: true })
  description: string; // Description of the Topic

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Forum' , required: true})
  forum_id: Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
