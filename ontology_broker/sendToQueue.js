const log = require('./sro_utils/logger');
const queueMapper = require('./queueMapper');
const {getAMQPChannel} = require('./amqp_utils');

const sendToQueue = ({message, queue, options={}}, cb) => {
        const amqpConfigKey = (undefined === typeof options.amqpConfigKey) ? options.amqpConfigKey : 'AMQP_URL';
        const mappedQueue = queueMapper[queue] ? queueMapper[queue]: 'junk';
        if(undefined !== typeof mappedQueue) {
            getAMQPChannel(amqpConfigKey, (err, channel) => {
                log.debug(message, queue);
                channel.assertQueue(mappedQueue, {durable: true});
                channel.sendToQueue(mappedQueue, new Buffer(JSON.stringify(message)));
                log.info(`Message sent to ${mappedQueue}`);
                cb();
            });
        };
};

module.exports = sendToQueue;