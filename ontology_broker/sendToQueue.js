const log = require('./sro_utils/logger');

const sendToQueue = (data, channel) => {
    const {ns} = data;
    if(ns) {
        channel.assertQueue(ns, {durable: true});
        channel.sendToQueue(ns, new Buffer(JSON.stringify(data)));
        log.info(`Message sent to ${ns}`);
    };
};

module.exports = sendToQueue;