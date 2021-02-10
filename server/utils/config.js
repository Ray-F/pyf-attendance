const dotenv = require('dotenv')
dotenv.config()

// Enum of the different environments
const Environment = {
  DEV: "DEV",
  PROD: "PROD"
}

// What environment we are currently in
const ENV = process.env.ENV.toUpperCase()

// Enum of the .env variable relevant for different environments
const DatabaseUri = {
  DEV: process.env.MONGODB_URI_DEV,
  PROD: process.env.MONGODB_URI_PROD
}

// Database configuration dependent on our current environment
const DB_URI = (ENV === Environment.DEV) ? DatabaseUri.DEV : DatabaseUri.PROD
const DB_NAME = (ENV === Environment.DEV) ? "pyf-attendance-dev" : "pyf-attendance"
const PORT = process.env.PORT || 9002
const CI_BUILD = process.env.CI === "true" || process.env.CI === "1"


module.exports = {
  ENV,
  DB_URI,
  DB_NAME,
  PORT,
  CI_BUILD
}