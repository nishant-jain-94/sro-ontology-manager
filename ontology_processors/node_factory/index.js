// # Node Factory

// ## index.js

const bulkQueryExecutor = require('./neo4j_utils/bulkQueryExecutor');

const uniqueConstraints = [
    'CREATE CONSTRAINT ON (n:user) ASSERT n.uniqueId IS UNIQUE',
    'CREATE CONSTRAINT ON (n:concept) ASSERT n.name IS UNIQUE',
    'CREATE CONSTRAINT ON (n:course) ASSERT n.courseId IS UNIQUE',
    'CREATE CONSTRAINT ON (n:content) ASSERT n.mediaContentId IS UNIQUE',
    'CREATE CONSTRAINT ON (n:resource) ASSERT n.resourceId IS UNIQUE'
];

bulkQueryExecutor(uniqueConstraints, (err) => {
    if(!err) {
        // The pipeline which orchestrates different stages in the Factory.

        // Imports the following dependencies.
        const nodeAck = require('./node.ack');
        const nodeStream = require('./node.consumer');
        const nodeFactory = require('./node.factory');

        // Orchestrates different stages in pipeline.
        // 1. The `nodeStream` from the consumer is streamed to the `nodeFactory` where the nodes gets created.
        // 2. Once the nodes get created an acknowledgement is sent to the channel announcing that the message has been created using `nodeAck`.  
        nodeStream.batchWithTimeOrCount(1000, 10000).pipe(nodeFactory).each(nodeAck);
    }
});

