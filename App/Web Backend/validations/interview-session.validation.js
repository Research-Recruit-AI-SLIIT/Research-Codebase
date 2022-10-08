const Joi = require('joi');

const interviewSessionCreate = {
  body: Joi.object().keys({
    interviewID: Joi.string().hex().length(24).required(),
  }),
};

const interviewSessionComplete = {
  body: Joi.object().keys({
    interviewSessionId: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  interviewSessionCreate,
  interviewSessionComplete,
};
