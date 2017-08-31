const getAMQPChannel = require('../getAMQPChannel');

const assertQueue = (amqpConfigKey='AMQP_URL', queue, options, callback) => {
    getAMQPChannel(amqpConfigKey, (err, channel) => {
        channel.assertQueue(queue, options, callback);
    });
};

module.exports = assertQueue;
