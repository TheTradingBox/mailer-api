#!/usr/bin/env node

var app = require('../app/app');
var debug = require('debug')('mailer-api:server');
var downgrade = require('downgrade')
var http = require('http');
var parallel = require('run-parallel')
var unlimited = require('unlimited');
var config = require('../config')

/**
 * Create HTTP & HTTPS server (if certs are available).
 */

var secret, secretKey, secretCert
try {
    secretKey = fs.readFileSync(path.join(__dirname, '../secret/mailer.key'))
    secretCert = fs.readFileSync(path.join(__dirname, '../secret/mailer.chained.crt'))
} catch (err) {
    console.log('No Certs supplied - no https server running.')
}

var server = http.createServer(app)
var httpsServer
if (secretKey && secretCert) {
    httpsServer = https.createServer({ key: secretKey, cert: secretCert }, app)
}

unlimited();

server.on('error', onError);
server.on('listening', onListening);

if (httpsServer) {
    httpsServer.on('error', onError);
    httpsServer.on('listening', onListening);
}

/**
 * Listen on provided port, on all network interfaces.
 */

var tasks = [
    function (cb) {
        server.listen(config.ports.http, cb)
    }
]

if (httpsServer) {
    tasks.push(function (cb) {
        httpsServer.listen(config.ports.https, cb)
    })
}

parallel(tasks, function (err) {
    if (err) throw err
    debug('listening on port %s', JSON.stringify(config.ports))
    downgrade()
})



/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
