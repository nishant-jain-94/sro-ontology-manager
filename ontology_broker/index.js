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
        numberOfRetries: 10
    }).stream();

    cb(null, oplogStream);
}

const streamOplogToOplogHandler = (oplogStream) => highland('data', oplogStream)
                                                               .through(oplogHandler)
                                                               .flatMap(sendToQueue)
                                                               .done();

async.waterfall([
    getMongoDBConnection.bind(null, 'local'),
    streamOplog,
    streamOplogToOplogHandler
]);

log.info("Tailing MongoDB Oplog");