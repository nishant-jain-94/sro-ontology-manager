const async = require('async');
const mongodb = require('mongodb');
const highland = require('highland');
const {getMongoDBConnection} = require('../../mongo_utils');

const byUpdateOperation = (oplog) => oplog.op == 'u';

const findDocumentById = (collection, id, db, cb) => {
    const _id = mongodb.ObjectID.isValid(id) ? new mongodb.ObjectID(id): id  
    db.collection(collection).findOne({_id: _id}, cb);   
};

const updateOplog = (oplog, document, cb) => {
    oplog.o = document;
    cb(null, oplog);
};

const toCompleteDocument = highland.wrapCallback((oplog, cb) => {
    const [dbName, collectionName] = oplog.ns.split('.');
    const {_id} = oplog.o2;
    async.waterfall([
        getMongoDBConnection.bind(null, dbName),
        findDocumentById.bind(null, collectionName, _id),
        updateOplog.bind(null, oplog)
    ], cb);
});

const toMessage = (oplog) => {
    return {queue: oplog.ns, message: oplog.o};
}

const updateStream =  highland.pipeline(
    highland.filter(byUpdateOperation),
    highland.map((message) => {console.log('update', message); return message}),
    highland.flatMap(toCompleteDocument),
    highland.map(toMessage)
)
                                
module.exports = updateStream;