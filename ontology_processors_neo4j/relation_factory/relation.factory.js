// # Relation Factory

// ## relation.factory.js

// The Factory where relations gets created.

// Imports the required dependencies.
// `mergeOrCreateNode` Merges the properties of the old relationship with the properties of the new node. If the old relationship doesn't exist it creates a new relationship.
const async = require('async');
const {sendToQueue} = require('./amqp_utils');
const highland = require('highland');
const log = require('./sro_utils/logger')('Relation_Factory');
const mergeOrCreateRelation = require('./neo4j_utils/mergeOrCreateRelation');

// `toObject` creates a new packet containing `header` and the `triple`
// 1. `header` - refers to the both data and the metadata of the Message fetched from the Queue.
// 2. `triple` - refers to the triple to be used for Node Creation.
const toObject = (message) => {
    const triple = JSON.parse(message.content.toString());
    const header = message;
    return {header, triple};
};

// `mergeOrCreateRelationWrapper` is a wrapper around mergeOrCreateRelation which makes it easier to use with highland pipeline.
const mergeOrCreateRelationWrapper = highland.wrapCallback(({header, triple}, cb) => {
    mergeOrCreateRelation(triple, (err, data) => {
        if (data.records.length === 0) {
            const messageData = {
                message: triple,
                queue: 'relation_factory'
            };
            sendToQueue(messageData);
        };
        cb(err, {header, data});
    });
});

// `relation_factory` is a stream with following stages
// 1. Converts the incoming message to the object using `toObject`
// 2. Maps the message to the `mergeOrCreateRelationWrapper` which either merges or creates a relation based on it's availability. 
const relation_factory = (s) => s.map(toObject).flatMap(mergeOrCreateRelationWrapper);

// Exports the `relation_factory`
module.exports = relation_factory;