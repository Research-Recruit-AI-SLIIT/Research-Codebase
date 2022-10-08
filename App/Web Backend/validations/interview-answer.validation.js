const Joi = require('joi');

const answerTheQuestion = {
  body: Joi.object().keys({
    answerId: Joi.string().hex().length(24).required(),
    answerUrl: Joi.string().required(),
  }),
};

module.exports = {
  answerTheQuestion,
};
