const { interviewService } = require('../services');
const catchAsync = require('./../utils/catchAsync');
const httpStatus = require('http-status');

const createInterviewCategory = catchAsync(async (req, res) => {
  const { name } = req.body;
  const interViewCategory = await interviewService.createInterviewCategory({ name });
  res.status(httpStatus.CREATED).json({ interViewCategory });
});

const getInterviewCategories = catchAsync(async (req, res) => {
  const interviewCategories = await interviewService.getInterviewCategories();
  res.status(httpStatus.OK).json({ interviewCategories });
});

const createInterview = catchAsync(async (req, res) => {
  const interviewPayload = req.body;
  interviewPayload.createdBy = req.user._id;
  const interview = await interviewService.createInterview(interviewPayload);
  res.status(httpStatus.CREATED).json({ interview });
});

const addQuestionToInterview = catchAsync(async (req, res) => {
  const question = req.body;
  const interview = await interviewService.addQuestionToInterview(question.interviewId, question);
  res.status(httpStatus.OK).json({ interview });
});

const getInterviews = catchAsync(async (req, res) => {
  const interviews = await interviewService.getInterviews();
  res.status(httpStatus.OK).json({ interviews });
});

const getInterviewById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const interview = await interviewService.getInterviewById(id);
  res.status(httpStatus.OK).json({ interview });
});

const getInterviewsByCategoryId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const interviews = await interviewService.getInterviewsByCategoryId(id);
  res.status(httpStatus.OK).json({ interviews });
});

const getInterviewsByOrganizationId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const interviews = await interviewService.getInterviewsByOrganizationId(id);
  res.status(httpStatus.OK).json({ interviews });
});

const updateInterviewQuestion = catchAsync(async (req, res) => {
  const question = req.body;
  const updatedQuestion = await interviewService.updateInterviewQuestion(question._id, question);
  res.status(httpStatus.OK).json({ updatedQuestion });
});

const updateInterview = catchAsync(async (req, res) => {
  const interview = req.body;
  const updatedInterview = await interviewService.updateInterview(interview._id, interview);
  res.status(httpStatus.OK).json({ updatedInterview });
});

const deleteInterview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedInterview = await interviewService.deleteInterview(id);
  res.status(httpStatus.OK).json({ deletedInterview });
});

const deleteInterviewQuestion = catchAsync(async (req, res) => {
  const { id } = req.params;
  const deletedQuestion = await interviewService.deleteInterviewQuestion(id);
  res.status(httpStatus.OK).json({ deletedQuestion });
});

const getInterviewsByCreatedBy = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const interviews = await interviewService.getInterviewsByCreatedBy(_id);
  res.status(httpStatus.OK).json({ interviews });
});

module.exports = {
  createInterviewCategory,
  getInterviewCategories,
  createInterview,
  getInterviews,
  getInterviewById,
  getInterviewsByCategoryId,
  addQuestionToInterview,
  updateInterviewQuestion,
  getInterviewsByOrganizationId,
  updateInterview,
  deleteInterview,
  deleteInterviewQuestion,
  getInterviewsByCreatedBy,
};
