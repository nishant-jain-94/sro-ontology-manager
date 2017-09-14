// # Ontology Broker

// ## ontology_broker/index.js

// Imports the required dependencies.
// 1. `queueMapper` maps an oplog of a particular type to their respective Queues.
// 2. `oplogHandler` is a stream which transforms
// the Oplog into to the acutal document in the mongo.
// 3. `getAMQPChannel` returns an `AMQPChannel` using `amqp_utils` module.
// 4. `getMongoDBConnection` returns a MongoDB Connection using `mongo_utils` module.
const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const { AMQP_URL } = require('./config');
const queueMapper = require('./queueMapper');
const oplogHandler = require('./oplog_handler');
const AmqpLib = require('simple-amqplib-wrapper');
const { getMongoDBConnection } = require('./mongo_utils');
const log = require('./commons/logger')('Ontology_Broker');

const amqp = new AmqpLib(AMQP_URL);

const createChannels = (cb) => {
  const queues = _.values(queueMapper);
  const assertQueues = queues.map(queue => amqp.assertQueue.bind(amqp, queue, { durable: true }));
  async.series(assertQueues, cb);
};

const toQueue = ({ message, queue }) => {
  const messageQueue = queueMapper[queue] || 'others';
  amqp.sendToQueue(messageQueue, message);
};

// `StreamOplog` is used to stream data from MongoDb's Oplog.
//  It accepts two arguments `db` and `cb`.
// `db` - Refers to the MongoDB's connection object
const streamOplog = (db, cb) => {
  const oplogStream = db.collection('oplog.rs').find({}, {
    tailable: true,
    awaitdata: true,
    numberOfRetries: -1
  }).stream();

  cb(null, oplogStream);
};

// `printForDebug` used for logging debug messages during development.
// Usually handy when used with Highland's stream.
const printForDebug = (data) => {
  log.debug(data);
  return data;
};

// `streamOplogToOplogHandler` inputs an `oplogStream` and
// 1. Then maps to `printForDebug` to logs messages.
// 2. Then passes through the `oplogHandler`.
// 3. Then maps it to the `toQueueStream`.
const streamOplogToOplogHandler = (oplogStream) => {
  oplogStream.on('error', (err) => {
    log.error(err);
    process.exit(1);
  });

  highland('data', oplogStream)
    .map(printForDebug)
    .through(oplogHandler)
    .each(toQueue)
    .done();
};


// The async waterfall does the following things in sequence
// 1. `getMongoDBConnection` - Get's the MongoDB connection using mongo_utils
// 2. `streamOplog` - Using the MongoDB connection object call the
// `streamOplog` to stream Oplog from MongoDB
// 3. `streamOplogToOplogHandler` - Maps the stream to OplogHandler,
// which in return add's it to the queue
async.series([
  createChannels,
  async.waterfall.bind(null, [
    getMongoDBConnection.bind(null, 'local'),
    streamOplog,
    streamOplogToOplogHandler
  ])
]);

log.info('Tailing MongoDB Oplog');
