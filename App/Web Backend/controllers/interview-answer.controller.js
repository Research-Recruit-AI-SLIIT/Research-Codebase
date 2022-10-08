const httpStatus = require('http-status');
const { interviewAnswerService } = require('../services');
const catchAsync = require('../utils/catchAsync');

// answer the question
const addAnswer = catchAsync(async (req, res) => {
  const { answerId, answerUrl } = req.body;
  const answer = await interviewAnswerService.addAnswer(answerId, answerUrl);
  res.status(httpStatus.OK).json({ answer });
});

module.exports = {
  addAnswer,
};
