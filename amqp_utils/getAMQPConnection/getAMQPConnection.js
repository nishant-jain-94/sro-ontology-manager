const amqp = require('amqplib/callback_api');
const log = require('../sro_utils/logger')('AMQP_UTILS:GET_AMQP_CONNECTION');

const connection = {};

const getAMQPConnection = (amqpURL, callback) => {
  if(connection[amqpURL]) {
    callback(null, connection[amqpURL]);
    return;
  }
  amqp.connect(amqpURL, (err, conn) => {
    if(err) {
      log.debug(err);
      callback(err);
      return;
    }
    connection[amqpURL] = conn;
    callback(null, connection[amqpURL]);
  });
};

module.exports = getAMQPConnection;
