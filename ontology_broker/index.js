const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const sendToQueue = highland.wrapCallback(require('./sendToQueue'));
const oplogHandler = require('./oplog_handler');
const {getMongoDBConnection} = require('./mongo_utils');

const streamOplog = (db, cb) => {
    const oplogStream = db.collection('oplog.rs').find({}, {
        tailable: true,
        awaitdata: true,
        numberOfRetries: -1
    }).stream();

    cb(null, oplogStream);
};

const printForDebug = (data) => {
    log.debug(data);
    return data;
};

const streamOplogToOplogHandler = (oplogStream) => {
    oplogStream.on('error', (err) => {
        process.exit(1);
    });

    highland('data', oplogStream)
            .map(printForDebug)
            .through(oplogHandler)
            .flatMap(sendToQueue)
            .done();

}

async.waterfall([
    getMongoDBConnection.bind(null, 'local'),
    streamOplog,
    streamOplogToOplogHandler
]);

log.info("Tailing MongoDB Oplog");