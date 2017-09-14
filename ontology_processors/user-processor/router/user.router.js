// # User Router

// ## user.router.js

// Imports the required dependencies.
// `_.get` method determines if a property exists in an Object.
// Returns true if the property exists else returns false.
const _ = require('lodash');
const highland = require('highland');
const { AMQP_URL } = require('../config');
const AmqpLib = require('simple-amqplib-wrapper');
const log = require('../commons/logger')('USER_ROUTER_JS');

const amqp = new AmqpLib(AMQP_URL);

// `routeUserToFactory` routes the incoming user to the node factory.
// `createNodeObjects` inputs a triple.
// If the triple object has necessary properties for the node to be created.
// Then it sends the node the node_factory.
const routeUserToFactory = (data) => {
  const { triples } = data;

  const createNodeObjects = (triple) => {
    if (_.get(triple, 'source.properties.uniqueId') && _.get(triple, 'source.properties.identifier')) {
      amqp.sendToQueue('node_factory', triple.source);
      log.debug('Message Sent to Node Factory');
    }
  };

  triples.map(createNodeObjects);
  return data;
};

// Exports the routing pipeline. It maps the input stream to `routeUserToFactory`
module.exports = highland.pipeline(highland.map(routeUserToFactory));
