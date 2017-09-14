// # Media Content

// ## index.js (Media Content)

// Imports the required dependencies.
const _ = require('lodash');
const { AMQP_URL } = require('./config');
const AmqpLib = require('simple-amqplib-wrapper');
const mediaContentRouter = require('./router/media_content.router');
const mediaContentProcessor = require('./processor/media_content.processor');

const amqp = new AmqpLib(AMQP_URL);
const mediaContentStream = amqp.consumeStream('content');
const mediaContentAck = _.bind(amqp.acknowledge, amqp, _, true);

// Orchestrates the pipeline
// 1. The input `mediaContentStream` coming from the
// mediaContent consumer is piped to the `mediaContentProcessor`.
// 2. `mediaContentProcessor` processes the media and create triples of Media.
// 3. Then the output from the `mediaContentProcessor` is piped to
// the `mediaContentRouter` which routes the mediaContent to the node_factory and relation_factory.
// 4. Once the entire processing on the mediaContent is performed
// an acknowledgement is sent to the queue using `mediaContentAck`.
mediaContentStream
  .pipe(mediaContentProcessor)
  .pipe(mediaContentRouter)
  .map(message => message.header)
  .each(mediaContentAck);
