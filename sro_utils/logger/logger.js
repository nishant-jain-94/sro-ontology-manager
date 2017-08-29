const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const logger = (moduleName) => bunyan.createLogger({
    name: moduleName,
    level: 'debug'
});

module.exports = logger;