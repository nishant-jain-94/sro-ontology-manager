const bunyan = require('bunyan');
const bformat = require('bunyan-format');

const formatOut = bformat({ outputMode: 'bunyan' });

const log = bunyan.createLogger({ name: 'Ontology Processor API', stream: formatOut });

module.exports = log;
