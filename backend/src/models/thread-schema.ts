/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
// Import the reply schema

export type ThreadDocument = Thread & Document;

@Schema({ timestamps: true })
export class Thread {
 

  @Prop({ required: true })
  threadTitle: string; // Title of the thread (the main subject of the thread)

  @Prop({ required: true })
  content: string; // Content of the thread

  @Prop({type: MongooseSchema.Types.ObjectId , ref: 'Forum' , required: true})
  forum_id:  Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId; // Reference to the user who created the thread
  
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Topic' }] })
  topic_id: Types.ObjectId[]; // References to replies within the thread

}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
