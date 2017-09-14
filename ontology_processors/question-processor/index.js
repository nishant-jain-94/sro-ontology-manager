// # Learning Resource

// ## index.js (Questions)

// Imports the required dependencies.
const _ = require('lodash');
const { AMQP_URL } = require('./config');
const questionRouter = require('./router');
const questionProcessor = require('./processor');
const AmqpLib = require('simple-amqplib-wrapper');

const amqp = new AmqpLib(AMQP_URL);
const questionStream = amqp.consumeStream('questions');
const questionAck = _.bind(amqp.acknowledge, amqp, _, true);
// Orchestrates the pipeline
// 1. The input `questionStream` coming from the questions
// consumer is piped to the `questionProcessor`.
// 2. `questionProcessor` processes the questions and create nodes for questions.
// 3. Then the output from the `questionProcessor` is piped to the `questionRouter`
// which routes the question to the node_factory and relation_factory.
// 4. Once the entire processing on the questions is performed an acknowledgement
// is sent to the queue using `questionAck`.
questionStream.pipe(questionProcessor).pipe(questionRouter).each(questionAck);
