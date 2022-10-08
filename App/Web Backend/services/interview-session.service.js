const { Interview, InterviewSession, InterviewAnswer } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * create interview session
 * @param {interviewId} interviewID
 *
 * @returns {Promise<InterviewSession>}
 */
const createInterviewSession = async (interviewID, userId) => {
  const interview = await Interview.findById(interviewID);
  if (!interview || interview.questions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found or no questions');
  }
  const interviewSessionCheck = await InterviewSession.findOne({
    interview: interview,
    userId,
  });
  if (interviewSessionCheck) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You have already started this interview');
  }

  const interviewSession = new InterviewSession({
    interview: interview._id,
    userId: userId,
  });

  for (question of interview.questions) {
    const interviewAnswer = new InterviewAnswer({
      question: question,
      interviewSessionId: interviewSession._id,
    });
    await interviewAnswer.save();
    interviewSession.answers.push(interviewAnswer);
  }
  interviewSession.populate('answers.question');
  interviewSession.populate('interview');
  return await interviewSession.save();
};

//Complete interview session
const completeInterviewSession = async (interviewSessionId, userId) => {
  const interviewSession = await InterviewSession.findById(interviewSessionId);
  if (!interviewSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview session not found');
  }

  interviewSession.isCompleted = true;
  return await interviewSession.save();
};

const getInterviewSession = async (interviewSessionId) => {
  const interviewSession = await InterviewSession.findById(interviewSessionId);
  if (!interviewSession) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview session not found');
  }
  return interviewSession;
};
module.exports = {
  createInterviewSession,
  completeInterviewSession,
  getInterviewSession,
};
