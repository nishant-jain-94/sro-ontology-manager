const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const formatOut = bformat({outputMode: 'short', levelInString: true});

const logger = (moduleName) => bunyan.createLogger({
    name: moduleName,
    stream: formatOut,
    level: 'debug'
});

module.exports = logger;