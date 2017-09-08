const bunyan = require('bunyan');

const logger = moduleName => bunyan.createLogger({
  name: moduleName,
  level: 'debug',
});

module.exports = logger;
