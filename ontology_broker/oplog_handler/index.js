// # Ontology Broker

// ## ontology_broker/oplog_handler/index.js

const highland = require('highland');
const insertHandler = require('./insertHandler');
const updateHandler = require('./updateHandler');

// `handlers` creates a collection of `insertHandler` and `updateHandler`
const handlers = [
  insertHandler,
  updateHandler
];

// `oplogHandler` forks input stream to `inputHandler` and
// `updateHandler` and then returns a merged stream.
const oplogHandler = (s) => {
  const streams = handlers.map(handler => s.fork().pipe(handler));
  return highland(streams).merge();
};

// Exports a merged stream of `insertHandler` and `updateHandler`
module.exports = oplogHandler;
