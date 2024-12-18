import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export class CreateModuleDto {
    course_id : mongoose.Schema.Types.ObjectId;
    title: string;
    difficulty: string;
    content: string;
    resources?: string[];
    created_at: Date;
}