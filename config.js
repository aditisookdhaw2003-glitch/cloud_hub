require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4001,
  DB_FILE: 'db.json',
  jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};