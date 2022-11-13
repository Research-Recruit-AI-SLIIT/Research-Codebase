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
    con_eye_contact: {
      type: Number,
      default: 5,
    },
    con_smile: {
      type: Number,
      default: 5,
    },
    con_facial: {
      type: Number,
      default: 5,
    },
    con_behavior: {
      type: Number,
      default: 5,
    },
    comm_fwp_good: {
      type: Number,
      default: 10,
    },
    comm_fwp_avg: {
      type: Number,
      default: 20,
    },
    comm_fpp_good: {
      type: Number,
      default: 10,
    },
    comm_fpp_avg: {
      type: Number,
      default: 20,
    },
    comm_sppm_good: {
      type: Number,
      default: 5,
    },
    comm_sppm_avg: {
      type: Number,
      default: 10,
    },
    com_fw: {
      type: Number,
      default: 5,
    },
    com_fp: {
      type: Number,
      default: 5,
    },
    com_sp: {
      type: Number,
      default: 5,
    },
    overall_knowd: {
      type: Number,
      default: 3.81,
    },
    overall_positive: {
      type: Number,
      default: 4.6,
    },
    overall_con: {
      type: Number,
      default: 4.19,
    },
    overall_comm: {
      type: Number,
      default: 3.77,
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
