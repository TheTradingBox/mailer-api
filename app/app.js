var compress = require('compression')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var jade = require('jade')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var url = require('url')

var index = require('../routes/index');
var mailer = require('../routes/mailer');
var config = require('../config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('x-powered-by', false)
app.set('view engine', 'jade');
app.engine('jade', jade.renderFile)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(compress())
app.use(function (req, res, next) {
    // Force SSL
    if (config.isProd && req.protocol !== 'https') {
        return res.redirect('https://' + req.hostname + req.url)
    }

    // Prevents IE and Chrome from MIME-sniffing a response. Reduces exposure to
    // drive-by download attacks on sites serving user uploaded content.
    res.header('X-Content-Type-Options', 'nosniff')

    // Prevent rendering of site within a frame.
    res.header('X-Frame-Options', 'DENY')

    // Enable the XSS filter built into most recent web browsers. It's usually
    // enabled by default anyway, so role of this headers is to re-enable for this
    // particular website if it was disabled by the user.
    res.header('X-XSS-Protection', '1; mode=block')

    // Force IE to use latest rendering engine or Chrome Frame
    res.header('X-UA-Compatible', 'IE=Edge,chrome=1')

    next()
})

app.use('/', index);
app.use('/api/mailer', mailer);

// catch 404
app.get('*', function (req, res) {
    res.status(404).render('error', {
        title: '404 Page Not Found - astatic-api',
        message: '404 Not Found',
        status: '404 Not Found',
        stack: ''
    })
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
      .render('error', {
        title: res.statusCode,
        message: err.message,
        status: res.statusCode,
        stack: err.stack
    })
});

module.exports = app;
