// # Node Factory Consumer

// ## node.consumer.js

// The Factory Consumer which consumes the message from the queue and creates Node.

// Imports the required dependencies.

// const log = require('../sro_utils/logger')('Node_Factory_Consumer');
const {messageStreamFromQueue} = require('../amqp_utils');

// `queue` refers to the name of the queue from where the messages have to be fetched.
const queue = 'node_factory';

// Exporting Message Stream
module.exports = messageStreamFromQueue('AMQP_URL', queue);
