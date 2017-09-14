// # Learning Resource Router

// ## learning_resource.router.js

// Imports the required dependencies.
const _ = require('lodash');
const highland = require('highland');
const { AMQP_URL } = require('../config');
const AmqpLib = require('simple-amqplib-wrapper');
const log = require('../commons/logger')('Learning_Resource_Router');

const amqp = new AmqpLib(AMQP_URL);

// `routeLearningResourceToFactory` routes a Learning Resource to a Node Factory.
// Checks for the properties.mediaContentId as a necessary property to create node.
// If the property exists it sends the node to the Node Factory.
const routeLearningResourceToFactory = (data) => {
  const { triples } = data;
  const createNodesAndRelationshipObjects = (triple) => {
    if (_.get(triple, 'source.properties.resourceId')) {
      log.debug('Sending to node factory');
      amqp.sendToQueue('node_factory', triple.source);
    }

    if (_.get(triple, 'target.properties.name')) {
      log.debug('Sending to node factory');
      amqp.sendToQueue('node_factory', triple.target);
    }

    if (_.get(triple, 'relation.properties.relation')) {
      log.debug('Sending to relation factory');
      amqp.sendToQueue('relation_factory', triple);
    }
  };

  triples.map(createNodesAndRelationshipObjects);

  return data;
};

// Exports the routing pipeline. It maps the input stream to `routeConceptsToFactory`
module.exports = highland.pipeline(highland.map(routeLearningResourceToFactory));
