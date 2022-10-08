const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { organizationService } = require('../services');

const createOrganization = catchAsync(async (req, res, next) => {
  const organization = await organizationService.createOrganization(req.body);
  res.status(httpStatus.CREATED).json({
    status: 'success',
    organization: organization,
  });
});

const getOrganizations = catchAsync(async (req, res, next) => {
  const organizations = await organizationService.getOrganizations();
  res.status(httpStatus.OK).json({
    status: 'success',
    organizations,
  });
});

module.exports = {
  createOrganization,
  getOrganizations,
};
