const mongoose = require('mongoose');

const interviewSessionSchema = mongoose.Schema(
  {
    interview: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Interview',
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    answers: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'InterviewAnswer',
      },
    ],
    isCompleted: {
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
 * @typedef InterviewSession
 */
const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSession;
