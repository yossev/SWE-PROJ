import { maxLength, minLength } from 'class-validator';

const mongoose = require('mongoose');
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const userSchema= new mongoose.Schema(
 {
    user_id:{
        type: String,
        min: 1,
        required: true,
    },
    name:{
      type: String,
      minLength: 3,
      maxLength: 50,
      required:true
    },
    email:{
        type:String,
        minLength: 10,
        maxLength: 50,
        required:true
    },
    password_hash:{
        type:String,
        minLength:5,
        required:true
    },
    role:{
        type:String,
        enum:['student','instructor','admin'],
        required:true
    },
    profile_picture_url:{
        type:String,
        minLength:10
    },
    created_at:{
        type:Date,
        default:Date.now,
        required:true
  }
},
);

module.exports = mongoose.model('UserModel', userSchema);