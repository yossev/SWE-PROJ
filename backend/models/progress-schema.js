const mongoose = require('mongoose');

const schemaOptions = {
  strict: false,
  timestamps: true,
};

const progressSchema = new mongoose.Schema(
  {
    progress_id: {
      type: String,
      required: true,
      minlength: 1, 
    },

    user_id : [{ type: Schema.Types.ObjectId, ref: 'User' , required: true}],
    course_id  : [{ type: Schema.Types.ObjectId, ref: 'User' }],

    completion_percentage: {
      type: Number, 
      required: true,
      min: 0, 
      max: 100, 
    },
    last_accessed: {
      type: Date, 
      default : Date.now,
      required: true,
    },
  },
);

module.exports = mongoose.model('ProgressModel', progressSchema);
