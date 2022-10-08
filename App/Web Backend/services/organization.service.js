const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('../utils/ApiError');

const createOrganization = async (organization) => {
  if (await Organization.isEmailTaken(organization.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Email is already taken. Email: ${organization.email}`);
  }
  return await new Organization(organization).save();
};

const getOrganizations = async () => {
  return await Organization.find();
};

module.exports = {
  createOrganization,
  getOrganizations,
};
