require('dotenv').config()
module.exports = {
  JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY || 'DEFAULT_SECRET_KEY',
  JWT_EXPIRY: 5*60*60 // 5 hours
};