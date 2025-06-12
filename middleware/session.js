const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    // secure: true, // Use this in production with HTTPS
  },
});

module.exports = sessionMiddleware;
