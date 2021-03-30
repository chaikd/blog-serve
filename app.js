var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const JWT = require('./public/javascripts/jwt');

var indexRouter = require('./routes/index');
var articleRouter = require('./routes/article');
var tagsRouter = require('./routes/tags');
var authRouter = require('./routes/auth');
var replyRouter = require('./routes/reply');
var commentRouter = require('./routes/comment');
var albumRouter = require('./routes/album');
var consoleCommentRouter = require('./routes/console/console-comment');
var consoleUserRouter = require('./routes/console/console-user');
var consoleTagsRouter = require('./routes/console/console-tags');
var consoleArticleRouter = require('./routes/console/console-article');
var consoleAlbumRouter = require('./routes/console/console-album');
var consoleReplyRouter = require('./routes/console/console-reply');
var consoleQiniuRouter = require('./routes/console/console-qiniu');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  var url = req.originalUrl;
  const needPower = url.indexOf('/console') >= 0;

  var userCookies=req.cookies._token; 
  if(needPower) {
    const jwt = new JWT(userCookies);
    const canIn = jwt.verifyToken();
    if (canIn && canIn.error) {
      next(res.status(401).send({message: '没有权限'}))
    }
  }
  next();
});

app.use('/api', indexRouter);
app.use('/api/article', articleRouter);
app.use('/api/tag', tagsRouter);
app.use('/api/auth', authRouter);
app.use('/api/reply', replyRouter);
app.use('/api/comment', commentRouter);
app.use('/api/album', albumRouter);
app.use('/api/console/tag', consoleTagsRouter);
app.use('/api/console/user', consoleUserRouter);
app.use('/api/console/article', consoleArticleRouter);
app.use('/api/console/album', consoleAlbumRouter);
app.use('/api/console/comment', consoleCommentRouter);
app.use('/api/console/reply', consoleReplyRouter);
app.use('/api/console/qiniu', consoleQiniuRouter);

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
  res.status(404).send({error: 'error'})
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
