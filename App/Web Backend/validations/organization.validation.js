const Joi = require('joi');

const create = {
  body: Joi.object().keys({
    organizationName: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

module.exports = {
  create,
};
