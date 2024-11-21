const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: true,
};

const modulesSchema = new mongoose.Schema(
  {
    module_id: {
      type: String,
      minLength: 1,
      required: true,
      unique: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      minLength: 1,
      maxLength: 100,
      required: true,
    },
    content: {
      type: String,
      minLength: 1,
      maxLength: 5000,
      required: true,
    },
    resources: {
      type: [String],
      required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
  },
  schemaOptions
);

module.exports = mongoose.model('Module', modulesSchema);

