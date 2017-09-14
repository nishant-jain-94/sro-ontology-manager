const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'bunyan' });

const log = name => bunyan.createLogger({ name, stream: formatOut, level: 'debug' });

module.exports = log;
