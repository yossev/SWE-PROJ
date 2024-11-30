/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;


@Schema()
export class User
 {
    @Prop({type: String,unique:true,minLength:1})
    user_id: String;
    @Prop({type:String,required:true,minLength:3,maxLength:50})
    name: string;
    @Prop({type:String,
        minLength: 10,
        maxLength: 50,
        required:true})
        email:string;
    @Prop({type:String,
        minLength:5})
    password_hash:String;
    @Prop({type:String,
        enum:['student','instructor','admin'],
        required:true})
        role:string;
    @Prop({type:String,
        minLength:10,required:false})
    profile_picture_url?:string;
    @Prop({type:Date,
        default:Date.now,
        required:true})
    created_at:Date;
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course' })
    courses: mongoose.Types.ObjectId[];
  }

  export const UserSchema = SchemaFactory.createForClass(User);