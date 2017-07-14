const async = require('async');
const should = require('should');
const mongodb = require('mongodb');
const highland = require('highland');

const {getMongoDBConnection} = require('../../mongo_utils');
const updateHandler = require('./oplog.update');

describe('Update Oplog Handler', (done) => {
    before((done) => {
        const document = {
                    "_id" : new mongodb.ObjectID("58ad820029abbc9e35aa9a8f"),
                    "title" : "CSS",
                    "context" : "Web user interfaces",
                    "identifier" : "info:fedora/learning:1443",
                    "categoryCounts" : [ ],
                    "contentCategories" : [ ],
                    "associations" : [ ],
                    "description" : "CSS",
                    "metadata" : {
                        "node_type" : "NODE",
                        "object_uri" : "info:fedora/learning:1443",
                        "setType" : "concept",
                        "context" : "Web user interfaces",
                        "nodeId" : "jsc430",
                        "description" : "CSS",
                        "identifier" : "info:fedora/learning:1443",
                        "descriptionVerified" : false
                    }
                };
        const insertDocument = (document, db, cb) => db.collection('test').insertOne(document, cb);
        async.waterfall([
            getMongoDBConnection.bind(null, 'sample'),
            insertDocument.bind(null, document)
        ], done)
    });

    it('Should Update Oplog Handler', (done) => {
        const oplogs = [
            {
                "v" : 2,
                "op" : "u",
                "ns" : "sample.test",
                "o2": {
                    "_id": new mongodb.ObjectID("58ad820029abbc9e35aa9a8f")
                },
                "o" : {
                    "$set": {
                        "title": "HTML"
                    }
	            }
            }
        ];

        highland((push, next) => {
            oplogs.forEach((oplog) => {
                push(null, oplog)
            });
            push(null, highland.nil);
        }).pipe(updateHandler).each((oplog) => {
            should.exist(oplog);
            oplog.message.title.should.be.exactly('CSS');
            oplog.message.context.should.be.exactly('Web user interfaces');
            done();
        });
    });

    after((done) => {
        const dropCollection = (db, cb) => db.collection('test').remove({}, cb);
        async.waterfall([
            getMongoDBConnection.bind(null, 'sample'),
            dropCollection
        ], done);
    });
});