// # Ontology Broker

// ## ontology_broker/oplog_handler/insertHandler/oplog.insert.js

const highland = require('highland');

// `byInsertOperation` is a filters operation which filters oplog by insert operation.
// It passes only oplogs with insert operation to the next stage in the pipeline.
const byInsertOperation = oplog => oplog.op === 'i';

// `toMessage` maps the oplog to a message.
const toMessage = oplog => ({ queue: oplog.ns, message: oplog.o });

// `insertStream` pipes the input stream through the following stages
// 1. Filters the Oplog by insert operation and then
// 2. Maps it to the Message
const insertStream = highland.pipeline(
  highland.filter(byInsertOperation),
  highland.map(toMessage),
);

// Exports the insertStream
module.exports = insertStream;
