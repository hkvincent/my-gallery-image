var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const imageFolderPath = path.join(__dirname, 'public', 'images');
const imageFiles = [];
fs.readdirSync(imageFolderPath).forEach((file) => {
  if ( /\.(jpe?g|png|gif|bmp)$/i.test(file) ) {
    imageFiles.push(file);
  }
});
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.locals.imageFiles = imageFiles;

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/api/images', (req, res) => {


  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const startIndex = (page - 1) * limit;

  const paginatedImages = app.locals.imageFiles.slice(startIndex, startIndex + limit);
  console.log(paginatedImages)
  res.json(paginatedImages);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
