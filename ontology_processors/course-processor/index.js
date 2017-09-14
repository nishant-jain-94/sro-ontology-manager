// # Course Processor

// ## index.js (Course Processor)

// Imports the required dependencies
const _ = require('lodash');
const { AMQP_URL } = require('./config');
const courseRouter = require('./router');
const courseProcessor = require('./processor');
const AmqpLib = require('simple-amqplib-wrapper');

const amqp = new AmqpLib(AMQP_URL);
const courseStream = amqp.consumeStream('course');
const courseAck = _.bind(amqp.acknowledge, amqp, _, true);

// Orchestrates the pipeline
// 1. The input `courseStream` coming from the course consumer is piped to the `courseProcessor`.
// 2. `courseProcessor` processes the course and create triples of courses.
// 3. Then the output from the `courseProcessor` is piped to the `courseRouter` which routes
// the courses to the node_factory and relation_factory.
// 4. Once the entire processing on the course is performed an acknowledgements
// is sent to the queue using `courseAck`.
courseStream
  .pipe(courseProcessor)
  .pipe(courseRouter)
  .map(message => message.header)
  .each(courseAck);
