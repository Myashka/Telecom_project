// modules setup
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const User = require('./models/user');
const Article = require('./models/article');
const user = require('./middleware/user');
const messages = require('./middleware/messages');
const register = require('./routes/register');
const login = require('./routes/login');
const articles = require('./routes/articles');

// .env setup
require('dotenv').config();

// app object creation
const app = express();

// port setup
app.set('port', process.env.PORT || 80);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// public files access
app.use(express.static(path.join(__dirname, 'public')));

// body-parsing middleware (e.g. to read req.body)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// session setup
app.use(session({
  secret: "foo",
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: MongoStore.create({
    mongoUrl: process.env.URI
  })
}));

// using user middleware for sessions
app.use(user);
// using messages middleware
app.use(messages);

start();

// handler setup for /register route
app.get('/register', register.form);
app.post('/register', register.submit);

// handler setup for /login route
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

// handler setup for /articles route
app.post('/articles', articles.submit);
app.get('/articles', articles.list);

app.get('/articles/article*', articles.showfull);
app.post('/articles/article*', articles.delete);

// mongodb connection setup
async function start() {
  try {
    await mongoose.connect(process.env.URI);
    app.get('/', (req, res) => {
      res.render('index', {title: 'Welcome page'})
    });
    app.listen(app.get('port'), () => {
      console.log('App started on port', app.get('port'))
    });
  } catch (e) {
    console.log(e);
  };
};
