const mongoose = require('mongoose');

const interviewAnswerSchema = mongoose.Schema(
  {
    interviewSessionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'InterviewSession',
    },
    question: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'InterviewQuestion',
    },
    answer: {
      type: String,
    },
    hasAnswered: {
      type: Boolean,
      default: false,
    },
    hasProcessed: {
      type: Boolean,
      default: false,
    },
    result: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef InterviewAnswer
 */
const InterviewAnswer = mongoose.model('InterviewAnswer', interviewAnswerSchema);

module.exports = InterviewAnswer;
