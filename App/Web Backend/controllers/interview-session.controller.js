const httpStatus = require('http-status');
const { interviewSessionService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const createInterviewSession = catchAsync(async (req, res, next) => {
  const { interviewID } = req.body;
  const { _id } = req.user;
  const interviewSession = await interviewSessionService.createInterviewSession(interviewID, _id);
  res.status(httpStatus.OK).json({ interviewSession });
});

//complete interview session
const completeInterviewSession = catchAsync(async (req, res, next) => {
  const { interviewSessionId } = req.body;
  const { _id } = req.user;
  const interviewSession = await interviewSessionService.completeInterviewSession(interviewSessionId, _id);
  res.status(httpStatus.OK).json({ interviewSession });
});

//get interview session by id
const getInterviewSessionById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const interviewSession = await interviewSessionService.getInterviewSession(id);
  res.status(httpStatus.OK).json({ interviewSession });
});

module.exports = {
  createInterviewSession,
  completeInterviewSession,
  getInterviewSessionById,
};
