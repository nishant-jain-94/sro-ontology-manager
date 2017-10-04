// # Relation Factory

// ## relation.factory.js

// The Factory where relations gets created.

// Imports the required dependencies.
// `mergeOrCreateNode` Merges the properties of the old relationship with the
// properties of the new node. If the old relationship doesn't exist
// it creates a new relationship.
const highland = require('highland');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const log = require('../commons/logger')('Relation_Factory');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

// `toObject` creates a new packet containing `header` and the `triple`
// 1. `header` - refers to the both data and the metadata of the Message fetched from the Queue.
// 2. `triple` - refers to the triple to be used for Node Creation.
const toObject = (message) => {
  const triple = JSON.parse(message.content.toString());
  const header = message;
  return { header, triple };
};

// `mergeOrCreateRelationWrapper` is a wrapper around
// mergeOrCreateRelation which makes it easier to use
// with highland pipeline.
const mergeOrCreateRelationWrapper = highland.wrapCallback(({ triple, header }, cb) => {
  neo4j.mergeOrCreateRelation(triple, (err, results) => {
    if (err) { log.error(err); return cb(err, null); }
    return cb(null, { header, results });
  });
});

// `relation_factory` is a stream with following stages
// 1. Converts the incoming message to the object using `toObject`
// 2. Maps the message to the `mergeOrCreateRelationWrapper` which
// either merges or creates a relation based on it's availability.
// const relation_factory = (s) => s.map(toObject).flatMap(mergeOrCreateRelationWrapper);

const relationFactory = highland.pipeline(
  highland.map(toObject),
  highland.flatMap(mergeOrCreateRelationWrapper),
);

// Exports the `relation_factory`
module.exports = relationFactory;
