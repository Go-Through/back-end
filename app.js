const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const env = 'envForSession';
const options = require(`${__dirname}/config/config.json`)[env];
const sessionStore = new MySQLStore(options);

const passportConfig = require('./passport');
const commonModule = require('./service/init-module');
const indexRouter = require('./routes/index');

const { generateKey } = require('./session-key');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(cors);
/* app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
}); */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: generateKey(),
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
