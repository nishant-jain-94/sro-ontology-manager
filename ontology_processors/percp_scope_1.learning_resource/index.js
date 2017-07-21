// # Learning Resource

// ## index.js (Learning Resource)

// Imports the required dependencies.
const learningResourceAck = require('./learning_resource.ack');
const learningResourceStream = require('./learning_resource.consumer');
const learningResourceProcessor = require('./learning_resource.processor');
const learningResourceRouter = require('./learning_resource.router');

// Orchestrates the pipeline
// 1. The input `learningResourceStream` coming from the learning_resource consumer is piped to the `learningResourceProcessor`.
// 2. `learningResourceProcessor` processes the learningResource and create triples of learningResource.
// 3. Then the output from the `learningResourceProcessor` is piped to the `learningResourceRouter` which routes the learningResource to the node_factory and relation_factory.
// 4. Once the entire processing on the learningResource is performed an acknowledgement is sent to the queue using `learningResourceAck`.
learningResourceStream.pipe(learningResourceProcessor).pipe(learningResourceRouter).each(learningResourceAck);