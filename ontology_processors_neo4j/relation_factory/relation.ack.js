const async = require('async');
const {getAMQPChannel} = require('./amqp_utils');
const log = require('./sro_utils/logger');

const ack = (message, channel, cb) => {
    channel.ack(message);
    log.debug("Message Acknowledged");
    cb();
};

module.exports = (message) => {
    async.waterfall([
        getAMQPChannel.bind(null, 'AMQP_URL'),
        ack.bind(null, message.header)
    ]);
};