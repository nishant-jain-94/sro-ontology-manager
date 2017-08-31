const _ = require('lodash');
const log = require('../sro_utils/logger')('AMQP_UTILS:MESSAGE_STREAM_FROM_QUEUE');
const async = require('async');
const highland = require('highland');
const getAMQPChannel = require('../getAMQPChannel');

const messageStreamFromQueue = (amqpConfigKey='AMQP_URL', queue) => {
    const getAMQPChannelWrapper = highland.wrapCallback(getAMQPChannel);
    return getAMQPChannelWrapper(amqpConfigKey).consume((err, val, push, next) => {
        if(!err) {
            val.consume(queue, (message) => {
                push(null, message);
            });
        } else {
            log.error(err);
        }
    });
};

module.exports = messageStreamFromQueue;
