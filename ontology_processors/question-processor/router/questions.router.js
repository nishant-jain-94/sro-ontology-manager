// # Question Router

// ## question.router.js

// Imports the required dependencies.
const _ = require('lodash');
const { AMQP_URL } = require('../config');
const AmqpLib = require('simple-amqplib-wrapper');
const highland = require('highland');
const log = require('../commons/logger')('Questions_Router');

const amqp = new AmqpLib(AMQP_URL);

// `routeQuestionsToFactory` routes a question to a Node Factory.
// Checks for the properties.identifier as a necessary property to create node.
// If the property exists it sends the node to the Node Factory.
const routeQuestionsToFactory = (data) => {
  const { triples } = data;
  const createNodesAndRelationshipObjects = (triple) => {
    if (_.get(triple, 'source.properties.identifier')) {
      log.debug('Sending to node factory');
      amqp.sendToQueue('node_factory', triple.source);
    }
  };

  triples.map(createNodesAndRelationshipObjects);
  return data;
};

// Exports the routing pipeline. It maps the input stream to `routeQuestionsToFactory`
module.exports = highland.pipeline(highland.map(routeQuestionsToFactory));
