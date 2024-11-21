const mongoose = require('mongoose');
const schemaOptions = {
  strict: false,
  timestamps: true,
};
const courseSchema= new mongoose.Schema(

 {
    course_id: {
      type: String,
      required:true,	
      minLength: 3,
          },
    title: {
      type: String,
      required:true,
      minLength: 3,
      maxLength: 100,
    },

    description: {
      type: String,
      required:true,
      minLength: 10,
      maxLength: 10000,
    },
    category: {
     type: String,
      required:true,
      minLength: 2,
      maxLength: 50,
    },
   
     difficulty_level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },

    created_by: {
      type: String,
      required:true,
      minLength: 20,
      maxLength: 500,
    },
     created_at: {
     type: Date,
     default: Date.now,
     required:true,
    },
  }
);


module.exports = mongoose.model('CourseModel', courseSchema);