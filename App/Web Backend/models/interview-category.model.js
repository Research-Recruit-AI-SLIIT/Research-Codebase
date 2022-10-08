const mongoose = require('mongoose');

const interviewCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef InterviewCategory
 */
const InterviewCategory = mongoose.model('InterviewCategory', interviewCategorySchema);

module.exports = InterviewCategory;
