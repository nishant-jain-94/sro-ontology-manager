const amqp = require('amqplib/callback_api');
const log = require('../sro_utils/logger');

let connection = {};

const getAMQPConnection = (amqpURL, callback) => {
    if(connection[amqpURL]) {
        callback(null, connection[amqpURL]); 
        return;
    }
    amqp.connect(amqpURL, (err, connection) => {
        if(err) {
            log.debug(err);
            callback(err);
            return;
        }
        connection[amqpURL] = connection;
        callback(null, connection[amqpURL]);
    });
};

module.exports = getAMQPConnection;