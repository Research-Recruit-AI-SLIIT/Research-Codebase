const httpStatus = require('http-status');
const { InterviewAnswer } = require('../models');

// add answer to the quesiton
const addAnswer = async (answerId, answerUrl) => {
  const answer = await InterviewAnswer.findById(answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Answer not found');
  }
  answer.answer = answerUrl;
  answer.hasAnswered = true;
  return await answer.save();
};

module.exports = {
  addAnswer,
};
