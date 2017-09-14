// # Learning Resource

// ## index.js (Questions)

// Imports the required dependencies.
const questionAck = require('./questions.ack');
const questionStream = require('./questions.consumer');
const questionProcessor = require('./questions.processor');
const questionRouter = require('./questions.router');

// Orchestrates the pipeline
// 1. The input `questionStream` coming from the questions consumer is piped to the `questionProcessor`.
// 2. `questionProcessor` processes the questions and create nodes for questions.
// 3. Then the output from the `questionProcessor` is piped to the `questionRouter` which routes the question to the node_factory and relation_factory.
// 4. Once the entire processing on the questions is performed an acknowledgement is sent to the queue using `questionAck`.
questionStream.pipe(questionProcessor).pipe(questionRouter).each(questionAck);