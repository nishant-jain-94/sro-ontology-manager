const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const {getAMQPChannel} = require('./amqp_utils');

const queue = 'percp_scope_1.media';

const consumeQueue = (push, channel) => {
    log.debug('Consumer Listening');
    channel.assertQueue(queue, {});
    channel.consume(queue, function(message) {
        log.debug(`Received Message in ${queue}`);
        push(null, message);
    }, {noack: false});
};

const messageStream = highland((push, next) => {
    async.waterfall([
        getAMQPChannel.bind(null, 'AMQP_URL'),
        consumeQueue.bind(null, push)
    ]);
});

    
module.exports = messageStream;

