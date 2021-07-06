import config from '../utils/Config';
import chalk from 'chalk';
import { version } from '../../package.json';
import app from '../app';
import debug from 'debug';
import http from 'http';
import { Logger } from '../utils/Logger';

// Get port from environment file
const port = normalizePort(config.PORT);
app.set('port', port);

const logger = Logger.getInstance();


logger.logInfo(`${chalk.bold(config.ENV)} server hosted on port: ${chalk.yellow(port)}`);
logger.logInfo(`CI set to: ${chalk.yellow(config.CI_BUILD)}`);
logger.logInfo(`Running application version: ${chalk.yellow(version)}\n`);

// Create the HTTP server and set function actions when events happen
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// If running a CI build, stop process after 5 seconds
setTimeout(() => {
  if (config.CI_BUILD) {
    console.info('[SERVER] no errors, finishing with exit code 0'.dim);
    process.exit(0);
  }
}, 5000);

/**
 * Normalises a port to the right server standard.
 *
 * @returns {boolean|number|*}
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  // If port is a named value, return that name or return port if it is a real port (false otherwise)
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

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

  // Handle specific listen errors with friendly messages
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
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
