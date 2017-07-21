// # Media Acknowledger

// ## media.ack.js

// Imports the required dependencies.
const async = require('async');
const {getAMQPChannel} = require('./amqp_utils');
const log = require('./sro_utils/logger')('Media_Acknowledger');

// `ack` Acknowledges the messsage to the Channel using the original `message` object which was dequeued from the queue.
// `ack` inputs the following parameters
// 1. `message` - refers to the message dequeued.
// 2. `channel` - refers to channel through which acknowledgement has to be made.
const ack = (message, channel, cb) => {
    channel.ack(message);
    log.debug('Acknowledged Message');
    cb();
};

// Acknowledger does the following operations
// 1. Gets the Channel using `getAMQPChannel`
// 2. Acknowledges the channel that the message which was dequeued is be processed using the `ack`
module.exports = (message) => {
    async.waterfall([
        getAMQPChannel.bind(null, 'AMQP_URL'),
        ack.bind(null, message.header)
    ]);
};