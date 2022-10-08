const mongoose = require('mongoose');
const User = require('../models/user.model');

const options = { discriminatorKey: 'kind' };

const Admin = User.discriminator('Admin', new mongoose.Schema({}, options));

module.exports = Admin;
