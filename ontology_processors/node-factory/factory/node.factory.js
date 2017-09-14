// # Node Factory

// ## node.factory.js

// Imports the following dependencies.
const _ = require('lodash');
const log = require('../commons/logger')('NODE_FACTORY');
const highland = require('highland');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

// `toObject` creates a new packet containing `header` and the `triple`
// 1. `header` - refers to the both data and the metadata of the Message fetched from the Queue.
// 2. `triple` - refers to the triple to be used for Node Creation.
const toObject = (messages) => {
  log.debug({ count: messages.length });
  const bulkMessages = messages.map((message) => {
    const triple = JSON.parse(message.content.toString());
    const header = message;
    return { header, triple };
  });
  return bulkMessages;
};

const bulkMergeOrCreateNode = (nodesToBeCreated, cb) => {
  const batch = nodesToBeCreated.map(({ properties, options = {} }) => {
    const uniqueConstraintsOn = options.uniqueConstraintsOn ? options.uniqueConstraintsOn : [];
    const uniqueProperties = _.pick(properties, ...uniqueConstraintsOn);
    const nodeProperties = _.omit(properties, 'label', ...uniqueConstraintsOn);
    const { label } = properties;
    const uniqueValue = uniqueProperties[uniqueConstraintsOn[0]];
    return { label, uniqueValue, nodeProperties };
  });

  log.debug({ batch });

  const query = `UNWIND {batch} as row
    FOREACH (_ IN CASE when row.label='user' then [1] else [] end |
    MERGE (n:user {uniqueId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='concept' then [1] else [] end |
    MERGE (n:concept {name: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='course' then [1] else [] end |
    MERGE (n:course {courseId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='content' then [1] else [] end |
    MERGE (n:content {mediaContentId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='resource' then [1] else [] end |
    MERGE (n:resource {resourceId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)`;

  neo4j.queryExecutorWithParams(query, { batch }, cb);
};

// `mergeOrCreateNodeWrapper` is a wrapper around mergeOrCreateNode
// which makes it easier to use with highland pipeline.
const mergeOrCreateNodeWrapper = highland.wrapCallback((bulkMessages, cb) => {
  const triples = bulkMessages.map(message => message.triple);
  const headers = bulkMessages.map(message => message.header);
  bulkMergeOrCreateNode(triples, (err, results) => {
    if (err) { log.error(err); process.exit(0); } else cb(null, { headers, results });
  });
});

// `node_factory` is a stream with following stages
// 1. Converts the incoming message to the object using `toObject`
// 2. Maps the message to the `mergeOrCreateNodeWrapper`
// which either merges or creates a node based on it's availability.
const nodeFactory = highland.pipeline(
  highland.map(toObject),
  highland.flatMap(mergeOrCreateNodeWrapper)
);

// Exports the `node_factory`
module.exports = nodeFactory;
