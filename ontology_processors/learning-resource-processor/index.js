// # Learning Resource

// ## index.js (Learning Resource)

// Imports the required dependencies.
const _ = require('lodash');
const { AMQP_URL } = require('./config');
const AmqpLib = require('simple-amqplib-wrapper');
const learningResourceRouter = require('./router');
const learningResourceProcessor = require('./processor');

const amqp = new AmqpLib(AMQP_URL);
const learningResourceAck = _.bind(amqp.acknowledge, amqp, _, true);
const learningResourceStream = amqp.consumeStream('learning_resource');

// Orchestrates the pipeline
// 1. The input `learningResourceStream` coming from
// the learning_resource consumer is piped to the `learningResourceProcessor`.
// 2. `learningResourceProcessor` processes the learningResource
// and create triples of learningResource.
// 3. Then the output from the `learningResourceProcessor` is piped
// to the `learningResourceRouter` which routes the
// learningResource to the node_factory and relation_factory.
// 4. Once the entire processing on the learningResource
// is performed an acknowledgement is sent to the queue using `learningResourceAck`.
learningResourceStream
  .pipe(learningResourceProcessor)
  .pipe(learningResourceRouter)
  .map(message => message.header)
  .each(learningResourceAck);
