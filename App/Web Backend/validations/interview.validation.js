const Joi = require('joi');

const interviewCategoryCreate = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const createInterview = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid('mock', 'real'),
    interviewCategory: Joi.string().required(),
    jobRole: Joi.string().required(),
    organization: Joi.string(),
    questions: Joi.array(),
    difficultyLevel: Joi.string().required().valid('easy', 'medium', 'hard'),
    time: Joi.number().required(),
  }),
};

const updateInterview = {
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().required(),
    type: Joi.string().required().valid('mock', 'real'),
    interviewCategory: Joi.string().required(),
    jobRole: Joi.string().required(),
    organization: Joi.string(),
    difficultyLevel: Joi.string().required().valid('easy', 'medium', 'hard'),
    questions: Joi.array(),
    createdBy: Joi.string().hex().length(24),
    time: Joi.number().required(),
  }),
};

const getInterviewById = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const addQuestionToInterview = {
  body: Joi.object().keys({
    interviewId: Joi.string().hex().length(24).required(),
    question: Joi.string().required(),
    sampleAnswers: Joi.array().items(Joi.string()),
    questionOrder: Joi.number().required(),
    questionType: Joi.string().required().valid('General', 'Mind Evaluation', 'Knowledge Evaluation'),
  }),
};

const updateInterviewQuestion = {
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
    question: Joi.string().required(),
    sampleAnswers: Joi.array().items(Joi.string()),
    questionOrder: Joi.number().required(),
    questionType: Joi.string().required().valid('General', 'Mind Evaluation', 'Knowledge Evaluation'),
  }),
};

const deleteInterview = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  interviewCategoryCreate,
  createInterview,
  updateInterview,
  getInterviewById,
  addQuestionToInterview,
  updateInterviewQuestion,
  deleteInterview,
};
