const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema(
  {
    responseId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    score: {
      type: Number,
      min: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('ResponseModel', responseSchema);