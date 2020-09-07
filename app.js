const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const cors = require('cors');

// session key
const secretResult = JSON.parse(fs.readFileSync(`${__dirname}/session-key.json`, 'utf8'));

// for session database
const env = 'envForSession';
const options = require(`${__dirname}/config/config.json`)[env];
const sessionStore = new MySQLStore(options);

const passportConfig = require('./passport');
const commonModule = require('./service/init-module');

commonModule.connectDB().then(console.log);

const indexRouter = require('./routes/index');
const shortestRouter = require('./routes/shortest');
const testRouter = require('./routes/test');
const tripInfoRouter = require('./routes/trip-info');
const myInfoRouter = require('./routes/my-info');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CORS 허용
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: secretResult.secret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: true,
    sameSite: 'None',
  },
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use(express.static(path.join(__dirname, 'public')));

// Router
app.use('/', indexRouter);
app.use('/shortest', shortestRouter);
app.use('/test', testRouter);
app.use('/trip-info', tripInfoRouter);
app.use('/my-info', myInfoRouter);
app.use('/docs', express.static(path.join(__dirname, 'doc')));

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
