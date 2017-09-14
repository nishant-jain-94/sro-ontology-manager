// # Concept Processor

// ## index.js (Concept Processor)

// Imports the required dependencies
const AmqpLib = require('simple-amqplib-wrapper');
const _ = require('lodash');

const amqp = new AmqpLib(process.env.AMQP_URL);
const conceptAck = _.bind(amqp.acknowledge, amqp, _, true);
const conceptStream = amqp.consumeStream('concept', { noAck: false });
const conceptProcessor = require('./processor');
const conceptRouter = require('./router');

// Orchestrates the pipeline
// 1. The input `conceptStream` coming from the concept consumer is piped to the `conceptProcessor`.
// 2. `conceptProcessor` processes the concept and create triples of concepts.
// 3. Then the output from the `conceptProcessor` is piped to the `conceptRouter`
// which routes the concepts to the node_factory and relation_factory.
// 4. Once the entire processing on the concept is performed an
// acknowledgement is sent to the queue using `conceptAck`.
conceptStream
  .pipe(conceptProcessor)
  .pipe(conceptRouter)
  .map(message => message.header)
  .each(conceptAck);
