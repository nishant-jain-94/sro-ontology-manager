const log = require('../sro_utils/logger')("AMQP_UTILS:SEND_TO_QUEUE");
const getAMQPChannel = require('../getAMQPChannel');

const sendToQueue = ({message, queue, options={}}, cb) => {
        const amqpConfigKey = (undefined === typeof options.amqpConfigKey) ? options.amqpConfigKey : 'AMQP_URL';
        if(undefined !== typeof mappedQueue) {
            getAMQPChannel(amqpConfigKey, (err, channel) => {
                log.debug(message, queue);
                channel.assertQueue(queue, {durable: true});
                channel.sendToQueue(queue, new Buffer(JSON.stringify(message)));
                log.info(`Message sent to ${queue}`);
                if (cb) cb();
            });
        };
};

module.exports = sendToQueue;