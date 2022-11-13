const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName:"recruitai"
    });

    logger.info('MongoDB Connection is up and running');
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
