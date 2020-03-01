const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Create app
const app = express();

// Install middleware
app.use(cookieParser());
app.use(bodyParser.json());

// Global filtering
// Set cookie
// Use session middleware
app.use((req, res, next) => {
  // console.log(req.app.locals) // eslint-disable-line no-console
  // console.log(app.locals) // eslint-disable-line no-console
  if (req.originalUrl === '/api/auth/login') {
    next();
  } else if (
    req.cookies.username &&
    req.cookies.username === req.app.locals.username
  ) {
    console.log('Logged in'); // eslint-disable-line no-console
    // res.json({ status: 'OK' })
    next();
  } else {
    throw new Error('User not logged in');
  }
});

// -- Routes --
// [POST] /login
app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  const valid = username.length && password === '123';

  if (!valid) {
    throw new Error('Invalid username or password');
  }
  // Write cookie
  res.cookie('username', username);
  app.locals.username = username;

  res.json({ status: 'OK' });
});

// [GET] /user
app.get('/user', (req, res, next) => {
  res.json({ user: req.user });
});

// [POST] /logout
app.post('/logout', (req, res, next) => {
  res.clearCookie('username');
  res.json({ status: 'OK' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // eslint-disable-line no-console
  res.status(401).send(err + '');
});

// -- export app --
module.exports = {
  path: '/api/auth',
  handler: app,
};
