const mongoose = require('mongoose');

const interviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['mock', 'real'],
    },
    interviewCategory: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'InterviewCategory',
    },
    jobRole: {
      type: String,
    },
    organization: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Organization',
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    questions: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'InterviewQuestion',
      },
    ],
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    time: {
      type: Number,
      required: true,
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Interview
 */
const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
