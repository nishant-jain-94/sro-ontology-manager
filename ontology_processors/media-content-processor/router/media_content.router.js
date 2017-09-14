// # Media Content Router

// ## media_content.router.js

// Imports the required dependencies.
// `doesPropertyExists` method determines if a property exists in an Object.
// Returns true if the property exists else returns false.
const _ = require('lodash');
const highland = require('highland');
const { AMQP_URL } = require('../config');
const AmqpLib = require('simple-amqplib-wrapper');

const amqp = new AmqpLib(AMQP_URL);

const createNodesAndRelationshipObjects = (triple) => {
  if (_.get(triple, 'source.properties.label') && _.get(triple, 'source.properties.mediaContentId')) {
    amqp.sendToQueue('node_factory', triple.source);
  }

  if (_.get(triple, 'relation.properties.relation')) {
    amqp.sendToQueue('relation_factory', triple);
  }
};

// `routeMediaContentToFactory` routes the incoming
// media content to node_factory and relation_factory.
// It inputs a `data` which has `triples` as an array.
// It maps each `triple` in the `triples` to `createNodesAndRelationshipObjects`
// which tends to create a node and relations for every triple.

// `createNodesAndRelationshipObject` inputs a `triple`
// 1. Then checks if the `source` has necessary properties for the node to be created.
// If so it is send to the node_factory with the `source` object.
// 2. Then checks if the `target` has necessary properties for the node to be created.
// If so it is send to the node_factory with the target object.
// 3. Then checks if the `relations` has necessary properties for the relationship to be created.
// If so it is send to the relation_factory with the object
// containing `source`. `target` and `relation`.
const routeMediaContentToFactory = (data) => {
  const { triples } = data;
  triples.map(createNodesAndRelationshipObjects);
  return data;
};

// Exports the routing pipeline. It maps the input stream to `routeConceptsToFactory`
module.exports = highland.pipeline(highland.map(routeMediaContentToFactory));
