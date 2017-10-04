// # Node Factory

// ## index.js

// The pipeline which orchestrates different stages in the Factory.

// Imports the following dependencies.
const _ = require('lodash');
const { promisify } = require('util');
const nodeFactory = require('./factory');
const log = require('./commons/logger')('NODE_FACTORY');
const AmqpLib = require('simple-amqplib-wrapper');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const {
  NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD, AMQP_URL
} = require('./config');

const amqp = new AmqpLib(AMQP_URL);
const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);
const nodeAck = _.bind(amqp.acknowledge, amqp, _, true);
const nodeStream = amqp.consumeStream('node_factory', { durable: true });
const bulkQueryExecutor = promisify(neo4j.bulkQueryExecutor.bind(neo4j));


// List of Unique constraints for all kind of nodes.
const queriesToCreateUniqueConstraints = [
  'CREATE CONSTRAINT ON (n:user) ASSERT n.uniqueId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:concept) ASSERT n.name IS UNIQUE',
  'CREATE CONSTRAINT ON (n:course) ASSERT n.courseId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:content) ASSERT n.mediaContentId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:resource) ASSERT n.resourceId IS UNIQUE'
];

(async () => {
  // Executes Unique Constraints for all kinds of node
  await bulkQueryExecutor(queriesToCreateUniqueConstraints);

  // A filter which returns only valid message.

  // Orchestrates different stages in pipeline.
  // 1. The `nodeStream` from the consumer is streamed
  // to the `nodeFactory` where the nodes gets created.
  // 2. Once the nodes get created an acknowledgement is sent to
  // the channel announcing that the message has been created using `nodeAck`.
  nodeStream
    .batchWithTimeOrCount(1000, 10000)
    .pipe(nodeFactory)
    .map(message => message.headers)
    .sequence()
    .each(nodeAck);
})();
