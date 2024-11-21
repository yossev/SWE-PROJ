const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      unique: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.String, 
      ref: 'ModuleModel',
      required: true,
    },
    questions: {
      type: [
        {
          text: { type: String, required: true, minLength: 3 },
          options: { type: [String], required: true },
          correctAnswer: { type: String, required: true },
        },
      ],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('QuizModel', quizSchema);