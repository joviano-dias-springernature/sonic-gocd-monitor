import app from '../server';
import http from 'http';
import https from 'https';
import fs from 'fs';
import Logger from '../server/utils/Logger';
import * as conf from '../app-config';

/**
 * Get port from environment and store in Express.
 */
const port = conf.port;
app.set('port', port);
/**
 * Create HTTP(s) server.
 */
let server;
if (conf.useHttps) {
  const privateKey = fs.readFileSync(conf.httpsKeyPath);
  const certificate = fs.readFileSync(conf.httpsCertificatePath);

  server = https.createServer({
      key: privateKey,
      cert: certificate
  }, app);
} else {
  server = http.createServer(app);
}
/**
 * Attach the server to socket.io
 */
const io = app.io
io.attach(server);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Logger.error(bind + ' requires elevated privileges');
      throw error;
    case 'EADDRINUSE':
      Logger.error(bind + ' is already in use');
      throw error;
    default:
      Logger.error('Fail!!!');
      Logger.error(error);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  Logger.debug('Listening on ' + bind);
}
