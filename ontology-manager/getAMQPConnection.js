const amqp = require('amqplib/callback_api');

let connection = {};

const getAMQPConnection = (amqpURL, callback) => {
    if(connection[amqpURL]) {
        callback(null, connection[amqpURL]); 
        return;
    }
    amqp.connect(amqpURL, (err, connection) => {
        if(err) {
            callback(err);
            return;
        }
        connection[amqpURL] = connection;
        callback(null, connection[amqpURL]);
    });
};

module.exports = getAMQPConnection;