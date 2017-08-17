// # Learning Resource Consumer

// ## learning_resource.consumer.js

// Imports the required depenedencies.
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger')('Learning_Resource_Consumer');
const {getAMQPChannel} = require('./amqp_utils');

// `queue` refers to the name of the queue.
const queue = 'learning_resource';

// `consumeQueue` Consumes Message from `learning_resource` queue using the `channel` and then push into the stream using the `push` function.
const consumeQueue = (push, channel) => {
    log.debug(`Consuming from ${queue} queue`);
    channel.assertQueue(queue, {});
    channel.consume(queue, function(message) {
        log.debug(`Received Message in ${queue}`);
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
    ]);
});

// Exports the messageStream
module.exports = messageStream;