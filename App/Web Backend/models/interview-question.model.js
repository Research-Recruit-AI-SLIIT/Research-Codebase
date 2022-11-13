const mongoose = require('mongoose');

const interviewQuestionSchema = mongoose.Schema(
  {
    interviewId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Interview',
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    sampleAnswers: [
      {
        type: String,
      },
    ],
    questionOrder: {
      type: Number,
      required: true,
    },
    questionType: {
      type: String,
      enum: ['General', 'Mind Evaluation', 'Knowledge Evaluation'],
      default: 'General',
    },
    knowledgeArea: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef InterviewQuestion
 */
const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);

module.exports = InterviewQuestion;
