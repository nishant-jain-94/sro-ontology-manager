// # Learner State

// ## index.js (learner_state)

// Imports the required dependencies
const _ = require('lodash');
const { AMQP_URL } = require('./config');
const learnerStateRouter = require('./router');
const AmqpLib = require('simple-amqplib-wrapper');
const learnerStateProcessor = require('./processor');

const amqp = new AmqpLib(AMQP_URL);
const learnerStateStream = amqp.consumeStream('learner_state');
const learnerStateAck = _.bind(amqp.acknowledge, amqp, _, true);

// Orchestrates the pipeline
// 1. The input `learnerStateStream` coming from the
// learner_state consumer is piped to the `learnerStateProcessor`.
// 2. `learnerStateProcessor` processes the learnerState
// and create triples of learnerState.
// 3. Then the output from the `learnerStateProcessor` is piped
// to the `learnerStateRouter` which routes the learnerState to
// the node_factory and relation_factory.
// 4. Once the entire processing on the learner_state is performed
// an acknowledgement is sent to the queue using `learnerStateAck`.
learnerStateStream
  .pipe(learnerStateProcessor)
  .pipe(learnerStateRouter)
  .map(message => message.header)
  .each(learnerStateAck);
