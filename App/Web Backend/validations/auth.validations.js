const joi = require('joi');

const createUser = {
  body: joi.object().keys({
    email: joi.string().required().email(),
    password: joi.string().required().min(6),
    name: joi.string().required(),
    role: joi.string().required().valid('admin', 'candidate', 'recruiter'),
    organizationId: joi.string().hex().length(24),
  }),
};

const login = {
  body: joi.object().keys({
    email: joi.string().required(),
    password: joi.string().required(),
  }),
};

const logout = {
  body: joi.object().keys({
    refreshToken: joi.string().required(),
  }),
};

const refreshTokens = {
  body: joi.object().keys({
    refreshToken: joi.string().required(),
  }),
};

module.exports = {
  createUser,
  login,
  logout,
  refreshTokens,
};
