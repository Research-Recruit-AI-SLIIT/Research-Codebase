const { InterviewCategory, Interview, Organization } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const InterviewQuestion = require('../models/interview-question.model');

/**
 * create category for interviews
 * @param {object} interviewCategory
 * @returns {Promise<InterviewCategory>}
 */
const createInterviewCategory = async (interviewCategory) => {
  return await new InterviewCategory(interviewCategory).save();
};

/**
 * get interview categories
 * @returns {Promise<InterviewCategory[]>}
 */
const getInterviewCategories = async () => {
  const categories = await InterviewCategory.find();
  if (categories.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No interview categories found');
  }
  return categories;
};

/**
 * create interview
 * @param {object} interview
 * @returns {Promise<Interview>}
 */
const createInterview = async (interview) => {
  return await new Interview(interview).save();
};

/**
 * add question to interview
 * @param {string} id
 * @param {object} question
 * @returns {Promise<Interview>}
 */
const addQuestionToInterview = async (id, question) => {
  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found');
  }
  const questionObj = await InterviewQuestion(question).save();
  interview.questions.push(questionObj);
  await interview.save();
  await interview.populate('questions');
  return interview;
};

const updateInterviewQuestion = async (id, question) => {
  const questionObj = await InterviewQuestion.findByIdAndUpdate(id, question, { new: true });
  if (!questionObj) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  return questionObj;
};

/**
 * get all interviews
 * @returns {Promise<Interview[]>}
 * @throws {ApiError}
 */
const getInterviews = async () => {
  const interviews = await Interview.find().populate('interviewCategory').populate('questions').populate('organization');
  if (interviews.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No interviews found');
  }
  return interviews;
};

/**
 * get interview by id
 * @param {string} id
 * @returns {Promise<Interview>}
 * @throws {ApiError}
 */
const getInterviewById = async (id) => {
  const interview = await Interview.findById(id).populate('interviewCategory').populate('questions');
  if (!interview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found');
  }
  return interview;
};

/**
 * get interview by category id
 * @param {string} id
 * @returns {Promise<Interview>}
 * @throws {ApiError}
 */
const getInterviewsByCategoryId = async (id) => {
  const interviewCategory = await InterviewCategory.findById(id);
  if (!interviewCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cannot find interview category');
  }
  const interviews = await Interview.find({ interviewCategory }).populate('interviewCategory').populate('questions');
  if (interviews.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No interviews found for this category');
  }
  return interviews;
};

/**
 * get interview by organization id
 * @param {string} id
 * @returns {Promise<Interview>}
 * @throws {ApiError}
 */
const getInterviewsByOrganizationId = async (id) => {
  const organization = await Organization.findById(id);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  const interviews = await Interview.find({ organization }).populate('interviewCategory').populate('questions');
  if (interviews.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No interviews found for this organization');
  }
  return interviews;
};

/**
 * update interview
 * @param {string} id
 * @param {object} interview
 * @returns {Promise<Interview>}
 * @throws {ApiError}
 */
const updateInterview = async (id, interview) => {
  const updatedInterview = await Interview.findByIdAndUpdate(id, interview, { new: true });
  if (!updatedInterview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found');
  }
  return updatedInterview;
};

/**
 * delete interview
 * @param {string} id
 * @returns {Promise<Interview>}
 */
const deleteInterview = async (id) => {
  const interview = await Interview.findById(id);
  if (!interview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found');
  }
  await interview.remove();
};

/**
 * delete interview question
 * @param {string} id
 * @returns {Promise<InterviewQuestion>}
 */
const deleteInterviewQuestion = async (id) => {
  const question = await InterviewQuestion.findById(id);
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  // remove question from the interview
  const interview = await Interview.findById(question.interviewId);
  if (!interview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Interview not found');
  }
  //remove interivew question from the interview question array
  interview.questions = interview.questions.filter((q) => !q.equals(question._id));

  await interview.save();
  await question.remove();
};

//get interviews by created by  id
const getInterviewsByCreatedBy = async (id) => {
  const interviews = await Interview.find({ createdBy: id })
    .populate('interviewCategory')
    .populate('questions')
    .populate('organization');

  return interviews;
};

module.exports = {
  createInterviewCategory,
  getInterviewCategories,
  createInterview,
  addQuestionToInterview,
  getInterviews,
  getInterviewById,
  getInterviewsByCategoryId,
  getInterviewsByOrganizationId,
  updateInterview,
  deleteInterview,
  updateInterviewQuestion,
  deleteInterviewQuestion,
  getInterviewsByCreatedBy,
};
