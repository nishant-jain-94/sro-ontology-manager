// # Node Factory

// ## index.js

// The pipeline which orchestrates different stages in the Factory.

// Imports the following dependencies.
const nodeAck = require('./node.ack');
const nodeStream = require('./node.consumer');
const nodeFactory = require('./node.factory');

// Orchestrates different stages in pipeline.
// 1. The `nodeStream` from the consumer is streamed to the `nodeFactory` where the nodes gets created.
// 2. Once the nodes get created an acknowledgement is sent to the channel announcing that the message has been created using `nodeAck`.  
nodeStream.pipe(nodeFactory).each(nodeAck);