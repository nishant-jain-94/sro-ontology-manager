const getAMQPChannel = require('../getAMQPChannel');

const deleteQueue = (amqpConfigKey, queue, cb) => {
  getAMQPChannel(amqpConfigKey, (err, channel) => {
    try {
      channel.deleteQueue(queue);
    } catch(exception) {
      channel.emit('error');
    } finally {
      cb();
    }
  });
};

module.exports = deleteQueue;
