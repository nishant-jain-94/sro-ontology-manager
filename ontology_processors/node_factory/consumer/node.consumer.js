// # Node Factory Consumer

// ## node.consumer.js

// The Factory Consumer which consumes the message from the queue and creates Node.

// Imports the required dependencies.
const async = require('async');
const highland = require('highland');

const log = require('../sro_utils/logger')('Node_Factory_Consumer');
const {getAMQPChannel} = require('../amqp_utils');

// `queue` refers to the name of the queue.
const queue = 'node_factory';

// `consumeQueue` Consumes Message from `node_factory` queue using the `channel` and then push into the stream using the `push` function.
const consumeQueue = (push, channel) => {
    log.debug(`Consuming from ${queue} queue`);
    channel.assertQueue(queue, {});
    channel.consume(queue, function(message) {
        push(null, message);
    }, {noack: false});
};

// A `messageStream` has the following stages.
// 1. Get's the channel from where the messages are to be consumed using `getAMQPChannel`
// 2. Consumes Queue using `consumeQueue`.
const messageStream = highland((push) => {
    async.waterfall([
        getAMQPChannel.bind(null, 'AMQP_URL'),
        consumeQueue.bind(null, push)
    ], (err) => {
        if(err) return process.exit(0);
    });
}); 

// Exports the messageStream    
module.exports = messageStream;