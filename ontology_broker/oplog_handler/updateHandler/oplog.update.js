// # Ontology Broker

// ## ontology_broker/oplog_handler/updateHandler/oplog.update.js

// Imports required dependencies.
const _ = require('lodash');
const async = require('async');
const mongodb = require('mongodb');
const highland = require('highland');
const { getMongoDBConnection } = require('../../mongo_utils');
const log = require('../../commons/logger')('OPLOG_UPDATE_JS');

// `byUpdateOperation` - a filter function which filters
// the oplogs based on the kind of the operation.
// `op` in `oplog.op` refers to the operation in oplog. `u` refers to the update operation.
const byUpdateOperation = oplog => oplog.op === 'u';

// `findDocumentById` inputs the following parameter and finds a document from the MongoDB
// 1. `collection` - refers to the name of collection in MongoDB.
// 2. `id` - refers to the id of the document to be found.
// 3. `db` - refers to the db connection object.
// 4. `cb` - refers to the cb object.
const findDocumentById = (collection, id, db, cb) => {
  const _id = mongodb.ObjectID.isValid(id) ? new mongodb.ObjectID(id) : id;
  db.collection(collection).findOne({ _id }, cb);
};

// `updateOplog` transforms the oplog by replacing
// a update portion with the entire `document` fetched from MongoDB.
// 1. `oplog` - refers to the oplog streamed from MongoDB.
// 2. `document` - refers to the document fetched from MongoDB
// 3. `cb` - refers to the callback which has to be called once the oplog is updated.
const updateOplog = (oplog, document, cb) => {
  const updatedOplog = _.assignIn(oplog, { o: document });
  cb(null, updatedOplog);
};


// `toCompleteDocument` - maps the oplog to the complete document using the following steps.
// 1. Fetches the name of the db and collection from the Oplog's namespace `oplog.ns`.
// 2. Fetches the object Id present in `oplog.o2`
// 3. Get's the MongoDB's Connection Object using `getMongoDBConnection`.
// 4. Finds the Document using the combination of databaseName,
// Collection and the objectId using `findDocumentsById`
// 5. Updates the Oplog with the new Document fetched from the MongoDB.
const toCompleteDocument = highland.wrapCallback((oplog, cb) => {
  const [dbName, collectionName] = oplog.ns.split('.');
  const { _id } = oplog.o2;
  async.waterfall([
    getMongoDBConnection.bind(null, dbName),
    findDocumentById.bind(null, collectionName, _id),
    updateOplog.bind(null, oplog)
  ], cb);
});

// `toMessage` maps the oplog to a message.
const toMessage = oplog => ({ queue: oplog.ns, message: oplog.o });

// `updateStream` pipes the input stream through the following stages.
// 1. `byUpdateOperation` - the stream initially get filtered by the type of their operation.
// It passes only the update operations onto the next stage onto the next stage.
// 2. `toCompleteDocument` - maps the partial update document to the Complete MongoDB Document
// which kinda of becomes helpful in decision making for other Ontology Processors.
// 3. `toMessage` - maps the oplog to a Message.
const updateStream = highland.pipeline(
  highland.filter(byUpdateOperation),
  highland.map((message) => { log.debug('update', message); return message; }),
  highland.flatMap(toCompleteDocument),
  highland.map(toMessage),
);

// Exports an updateStream
module.exports = updateStream;
