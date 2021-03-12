import express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const app = express();

// Set view engine to 'pug'
app.set('view engine', 'pug');

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add client build path to static files (so that it can be served)
app.use(express.static(path.join(__dirname, '../client/build-latest')));

// Routes for all API required actions
app.use('/', require('./routes/MainRouter.js'));

// Redirect all other requests to client SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/build-latest/index.html'));
});

// Error handler
app.use((err, req, res) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500).send(err.message);
});

module.exports = app;