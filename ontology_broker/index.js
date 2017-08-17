// # Ontology Broker 

// ## ontology_broker/index.js

// Imports the required dependencies.
// 1. `queueMapper` maps an oplog of a particular type to their respective Queues.
// 2. `oplogHandler` is a stream which transforms the Oplog into to the acutal document in the mongo.
// 3. `getAMQPChannel` returns an `AMQPChannel` using `amqp_utils` module.
// 4. `getMongoDBConnection` returns a MongoDB Connection using `mongo_utils` module. 
const async = require('async');
const highland = require('highland');
const _ = require('lodash');
const log = require('./sro_utils/logger')('Ontology_Broker');
const queueMapper = require('./queueMapper');
const oplogHandler = require('./oplog_handler');
const {getAMQPChannel} = require('./amqp_utils');
const {getMongoDBConnection} = require('./mongo_utils');

const createChannels = (cb) => {
    const queues = _.uniq(_.values(queueMapper));
    log.debug(queues);  
    const amqpConfigKey = 'AMQP_URL';
    getAMQPChannel(amqpConfigKey, (err, channel) => {
        if (!err) {
            channel.on('return', (msg) => {
                log.debug("RETURN", msg);
            });
            const assertQueues = queues.map((queue) => { 
                const assertQueue = (cb) => {
                    channel.assertQueue(queue, {durable: true}, cb);
                };
               return assertQueue;
            });
            log.debug("Creating Channels");
            async.series(assertQueues, cb);
        } else {
            cb(err, null);
        }
    }); 
};

// `toQueue` basically inputs an object containing `message`, `queue`, `options`(optional) and a `cb` 
const toQueue = ({message, queue, options={}}, cb) => {
        const amqpConfigKey = (undefined === typeof options.amqpConfigKey) ? options.amqpConfigKey : 'AMQP_URL';
        const mappedQueue = queueMapper[queue];
        log.debug(!_.isUndefined(mappedQueue));
        if(!_.isUndefined(mappedQueue)) {
            getAMQPChannel(amqpConfigKey, (err, channel) => {
                log.debug(message, queue);
                const status = channel.sendToQueue(mappedQueue, new Buffer(JSON.stringify(message), {}, (err, result) => {
                    log.error(err);
                    log.debug({result: result});
                }));
                log.debug('Status', status);
                log.info(`Message sent to ${mappedQueue}`);
            });
        }
        cb();
};

// `toQueueStream` is a callback wrapped version og `toQueue` which can easily be used in combination with highland streams. 
const toQueueStream = highland.wrapCallback(toQueue);

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
            .flatMap(toQueueStream)
            .done();

}


// The async waterfall does the following things in sequence
// 1. `getMongoDBConnection` - Get's the MongoDB connection using mongo_utils
// 2. `streamOplog` - Using the MongoDB connection object call the `streamOplog` to stream Oplog from MongoDB
// 3. `streamOplogToOplogHandler` - Maps the stream to OplogHandler, which in return add's it to the queue

async.series([
    createChannels,
    async.waterfall.bind(null,  [
        getMongoDBConnection.bind(null, 'local'), 
        streamOplog,
        streamOplogToOplogHandler
    ])
]);

// async.waterfall();

log.info("Tailing MongoDB Oplog");  