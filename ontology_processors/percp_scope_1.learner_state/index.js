// # Learner State

// ## index.js (learner_state) 

// Imports the required dependencies
const learnerStateAck = require('./learner_state.ack');
const learnerStateStream = require('./learner_state.consumer');
const learnerStateProcessor = require('./learner_state.processor');
const learnerStateRouter = require('./learner_state.router');

// Orchestrates the pipeline
// 1. The input `learnerStateStream` coming from the learner_state consumer is piped to the `learnerStateProcessor`.
// 2. `learnerStateProcessor` processes the learnerState and create triples of learnerState.
// 3. Then the output from the `learnerStateProcessor` is piped to the `learnerStateRouter` which routes the learnerState to the node_factory and relation_factory.
// 4. Once the entire processing on the learner_state is performed an acknowledgement is sent to the queue using `learnerStateAck`.
learnerStateStream.pipe(learnerStateProcessor).pipe(learnerStateRouter).each(learnerStateAck);