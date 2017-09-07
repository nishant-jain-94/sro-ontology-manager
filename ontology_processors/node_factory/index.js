// # Node Factory

// ## index.js

// The pipeline which orchestrates different stages in the Factory.

const bulkQueryExecutor = require('./neo4j_utils/bulkQueryExecutor');
const log = require('./sro_utils/logger')('NODE_FACTORY_INDEX.JS');

// Creates Unique constraint for all kind of nodes.
const queriesToCreateUniqueConstraints = [
  'CREATE CONSTRAINT ON (n:user) ASSERT n.uniqueId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:concept) ASSERT n.name IS UNIQUE',
  'CREATE CONSTRAINT ON (n:course) ASSERT n.courseId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:content) ASSERT n.mediaContentId IS UNIQUE',
  'CREATE CONSTRAINT ON (n:resource) ASSERT n.resourceId IS UNIQUE',
];

bulkQueryExecutor(queriesToCreateUniqueConstraints, (err) => {
  if(!err) {
    // Imports the following dependencies.
    const nodeAck = require('./ack');
    const nodeStream = require('./consumer');
    const nodeFactory = require('./factory');

    // Orchestrates different stages in pipeline.
    // 1. The `nodeStream` from the consumer is streamed to the `nodeFactory` where the nodes gets created.
    // 2. Once the nodes get created an acknowledgement is sent to the channel announcing that the message has been created using `nodeAck`.  
    nodeStream.batchWithTimeOrCount(1000, 10000).pipe(nodeFactory).each(nodeAck);
  } else {
    log.error({err: err}, 'Error While Creating Unique Constraints using Bulk Query Executor');
  }
});

