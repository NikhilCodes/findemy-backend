import app from '../app.js';
import debugLib from 'debug';
import https from 'https';
import http from 'http';
import { readFileSync } from 'fs';

const debug = debugLib('express:server');

const port = process.env.PORT || '8080'

app.set('port', port);

const options = {
  key: readFileSync(`src/bin/server.key`),
  cert: readFileSync(`src/bin/server.cert`),
}

const server = https.createServer(options, app);
const httpServer = http.createServer(app);

server.listen(port);
server.on('error', onError)
server.on('listening', onListening)

httpServer.listen(8081);
httpServer.on('error', onError)
httpServer.on('listening', onListening)

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
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

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + port);
}