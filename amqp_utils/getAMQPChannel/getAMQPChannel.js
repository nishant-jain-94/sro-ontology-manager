const async = require('async');

const config = require('../config');
const getAMQPConnection = require('../getAMQPConnection');

let channels = {};

const listenOnChannelClose = (amqpUrl, channel) => {
    channel.on('close', function(err) {
        delete channels[amqpUrl];   
    });
};

const createChannel = (amqpURL, connection, callback) => {
    connection.createChannel((err, channel) => {
        channels[amqpURL] = channel;
        listenOnChannelClose(amqpURL, channel);
        callback(null, channels[amqpURL]);
        return; 
    });
};

const getAMQPChannel = (amqpConfigKey='AMQP_URL', callback) => {
    const amqpURL = config[amqpConfigKey];
    if (channels[amqpURL]) {
        callback(null, channels[amqpURL]);
        return;
    }

    async.waterfall([
        getAMQPConnection.bind(null, amqpURL),
        createChannel.bind(null, amqpURL)
    ], callback);

};

module.exports = getAMQPChannel;