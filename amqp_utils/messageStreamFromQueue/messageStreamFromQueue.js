const highland = require('highland');
const getAMQPChannel = require('../getAMQPChannel');
const log = require('../sro_utils/logger')('AMQP_UTILS:MESSAGE_STREAM_FROM_QUEUE');

const messageStreamFromQueue = (amqpConfigKey = 'AMQP_URL', queue) => {
  const getAMQPChannelWrapper = highland.wrapCallback(getAMQPChannel);
  return getAMQPChannelWrapper(amqpConfigKey).consume((err, val, push) => {
    if(!err) {
      val.consume(queue, (message) => {
        push(null, message);
        next();
      }, {noack: false});
    } else {
      log.error(err);
    }
  });
};

module.exports = messageStreamFromQueue;
