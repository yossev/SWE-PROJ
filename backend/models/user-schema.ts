import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true, unique: true, minLength: 1 })
  user_id: string;

  @Prop({ type: String, required: true, minLength: 3, maxLength: 50 })
  name: string;

  @Prop({
    type: String,
    minLength: 10,
    maxLength: 50,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    minLength: 5,
    required: true,
  })
  password_hash: string;

  @Prop({
    type: String,
    enum: ['student', 'instructor', 'admin'],
    required: true,
  })
  role: string;

  @Prop({
    type: String,
    minLength: 10,
  })
  profile_picture_url: string;

  @Prop({
    type: Date,
    default: Date.now,
    required: true,
  })
  created_at: Date;

  // New field: Array of quiz references
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Quiz', default: [] })
  quizzes: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
