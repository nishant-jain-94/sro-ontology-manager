// # Course Router

// ## course.router.js

// Imports the required dependencies.
const _ = require('lodash');
const highland = require('highland');
const AmqpLib = require('simple-amqplib-wrapper');
const log = require('../commons/logger')('Course_Router_JS');
const { AMQP_URL } = require('../config');

const amqp = new AmqpLib(AMQP_URL);
// `routeCourseToFactory` routes a Course to a Node Factory.
// Checks for the properties.identifier as a necessary property to create node.
// If the property exists it sends the node to the Node Factory.
const routeCourseToFactory = (data) => {
  const { triples } = data;
  const createNodesAndRelationshipObjects = (triple) => {
    if (_.get(triple, 'source.properties.courseId')) {
      log.debug('Sending to node factory');
      amqp.sendToQueue('node_factory', triple.source);
    }
  };

  triples.map(createNodesAndRelationshipObjects);
  return data;
};

// Exports the routing pipeline. It maps the input stream to `routeCourseToFactory`
module.exports = highland.pipeline(highland.map(routeCourseToFactory));
