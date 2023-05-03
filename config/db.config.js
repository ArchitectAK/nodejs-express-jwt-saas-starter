require('dotenv').config()
module.exports = {
  HOST: process.env.MONGO_URI || 'mongodb://127.0.0.1',
  PORT: process.env.MONGO_PORT || 27017,
  DB: process.env.MONGO_DB_NAME || "my_db"
};