const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/backend';

module.exports = session({
  secret: process.env.SESSION_SECRET || 'yourSecretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl, // ✅ Pass the correct URL here
    ttl: 60 * 60, // 1 hour (optional)
  }),
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    httpOnly: true,
    secure: false, // Set true if you're using HTTPS
  }
});
