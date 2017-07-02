#!/usr/bin/env node

var fs = require('fs')
var debug = require('debug')('mailer-api:server')
var downgrade = require('downgrade')
var http = require('http')
var https = require('https')
var parallel = require('run-parallel')
var unlimited = require('unlimited')
var path = require("path")
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

/**
 * Create HTTP server (use Nginx for https ssl).
 */

//var secret, secretKey, secretCert
//try {
//    secretKey = fs.readFileSync(path.join(__dirname, '..' + config.ssl.key))
//    secretCert = fs.readFileSync(path.join(__dirname, '..' + config.ssl.certificate))
//} catch (err) {
//    console.log(err.message + ' : No Certs supplied - no https server running.')
//}

// Create the Express App


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('x-powered-by', false)
app.set('view engine', 'jade');
app.engine('jade', jade.renderFile)

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(compress())
app.use(function (req, res, next) {

    // limit to sites using this script
    res.header('Access-Control-Allow-Origin', '*')

    // Force SSL
    //if (req.protocol !== 'https') {
    //    console.log('Received http request - redirecting to https.')
    //    return res.redirect('https://' + req.hostname + ':' + req.port + req.url)
    //}

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
        title: '404 Page Not Found - mailer-api',
        message: '404 Not Found',
        status: '404 Not Found',
        stack: ''
    })
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    //res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.error = err;

    // render the error page
    res.status(err.status || 500)
        .render('error', {
            title: res.statusCode,
            message: err.message,
            status: res.statusCode,
            stack: err.stack
        })
});

//if (secretKey && secretCert) {
//    server = https.createServer({ key: secretKey, cert: secretCert }, app)
//    port = config.ports.https
//} else {
var server = http.createServer(app)

//}

unlimited();

server.on('error', onError);
server.on('listening', onListening);


/**
 * Listen on provided port, on all network interfaces.
 */

var tasks = [
    function (cb) {
        server.listen(config.port, 'localhost', cb)
    }
]

parallel(tasks, function (err) {
    if (err) throw err
    debug('In %s mode', config.env)
    debug('Listening on port %s', config.port)
    downgrade()
})



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific listen errors with friendly messages
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('In %s mode', process.env.NODE_ENV)
  console.log('Listening on ' + bind);
}
