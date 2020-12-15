var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const mongoose= require('mongoose');
var passport = require('passport');
var config = require('./config');
var authenticate = require('./authenticate');
const Dishes = require('./models/dishes');

var app = express();
app.all('*',(req,res,next)=>{
  if(req.secure)
  return next();
  else{
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
  }
  });
const url = config.mongoUrl;
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var indexRouter = require('./routes/index');
const uploadRouter = require('./routes/uploadRouter');
var usersRouter = require('./routes/users');
const connect = mongoose.connect(url);

connect.then((db)=>{
	console.log("connected to server");
},(err)=>{console.log(err);});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/users',usersRouter);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter)
app.use('/imageUpload',uploadRouter);



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
