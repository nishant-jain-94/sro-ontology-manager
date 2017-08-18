const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const courses = require('./course/course.router');
const concepts = require('./concept/concept.router');
const contents = require('./content/content.router');
const log = require('./sro_utils/logger')('ONTOLOGY_PROCESSOR_API:APP.JS');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/concepts', concepts);
app.use('/contents', contents);
app.use('/courses', courses);

app.use('/private/v1/concept', concepts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('API Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  log.error("Exception In Ontology Processor API", err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500).send({error: err.message});
});

module.exports = app;
