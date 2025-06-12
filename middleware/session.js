const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only HTTPS in production
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
});

module.exports = sessionConfig;
