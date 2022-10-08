const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Check if email is taken
 * @param {string} email - The organization's email
 * @returns {Promise<boolean>}
 */
organizationSchema.statics.isEmailTaken = async function (email) {
  const organization = await this.findOne({ email });
  return !!organization;
};

/**
 * @typedef Organization
 */
const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
