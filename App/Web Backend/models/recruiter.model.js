const mongoose = require('mongoose');
const User = require('../models/user.model');

const options = { discriminatorKey: 'kind' };

const Recruiter = User.discriminator(
  'Recruiter',
  new mongoose.Schema(
    {
      organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
      },
    },
    options
  )
);

module.exports = Recruiter;
