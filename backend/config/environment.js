const dotenv = require('dotenv');

const loadEnvironmentVariables = () => {
  dotenv.config();

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }

  if (!process.env.ACCESS_TOKEN) {
    throw new Error('ACCESS_TOKEN is not defined in the environment variables');
  }
  if (!process.env.REFRESH_TOKE) {
    throw new Error('REFRESH_TOKEN is not defined in the environment variables');
  }

  if (!process.env.PORT) {
    throw new Error('PORT is not defined in the environment variables');
  }

  console.log('Environment variables loaded successfully');
};

module.exports = loadEnvironmentVariables;
