// const log = require('../sro_utils/logger')('AMQP_UTILS:SEND_TO_QUEUE');
const async = require('async');
const assertQueue = require('../assertQueue');
const getAMQPChannel = require('../getAMQPChannel');

const sendToQueue = ({message, queue, options = {}}, cb) => {
  const amqpConfigKey = (undefined === typeof options.amqpConfigKey) ? options.amqpConfigKey : 'AMQP_URL';
  if(undefined !== typeof mappedQueue) {
    async.series([
      assertQueue.bind(null, 'AMQP_URL', queue, {durable: true}),
      async.waterfall.bind(null, [
        getAMQPChannel.bind(null, amqpConfigKey),
        (channel, callback) => {
          channel.sendToQueue(queue, new Buffer(JSON.stringify(message), {mandatory: true}));
          callback();
        },
      ]),
    ], cb);
  }
};

module.exports = sendToQueue;
