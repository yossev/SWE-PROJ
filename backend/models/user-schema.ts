
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

const url = "mongodb://localhost:27017/"
mongoose.connect(url).then((ans) => { 
    console.log("Connecting SuccesFul!") 
  }).catch((err) => { 
    console.log("Error in the Connection") 
}) 

@Schema()
export class User
 {
    @Prop({type:String,required:true,unique:true,minLength:1})
    user_id: String;
    @Prop({type:String,required:true,minLength:3,maxLength:50})
    name: String;
    @Prop({type:String,
        minLength: 10,
        maxLength: 50,
        required:true})
        email:String;
    @Prop({type:String,
        minLength:5,
        required:true})
    password_hash:String;
    @Prop({type:String,
        enum:['student','instructor','admin'],
        required:true})
        role:String;
    @Prop({type:String,
        minLength:10})
    profile_picture_url:String;
    @Prop({type:Date,
        default:Date.now,
        required:true})
    created_at:Date;
        
  }

  export const UserSchema = SchemaFactory.createForClass(User);