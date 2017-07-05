const async = require('async');
const getAMQPChannel = require('../../getAMQPChannel');

const ack = (message, channel, cb) => {
    channel.ack(message);
    cb();
};

module.exports = (message, cb) => {
    console.log("Inside AcK ");
    async.waterfall([
        getAMQPChannel.bind(null, 'AMQP_URL'),
        ack.bind(null, message.header)
    ], cb);
};