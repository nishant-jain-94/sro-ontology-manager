const getAMQPChannel = require('./getAMQPChannel');
const getAMQPConnection = require('./getAMQPConnection');
const sendToQueue = require('./sendToQueue');
const messageStreamFromQueue = require('./messageStreamFromQueue');
const assertQueue = require('./assertQueue');
const config = require('./config');

module.exports = {assertQueue, config, getAMQPChannel, getAMQPConnection, sendToQueue, messageStreamFromQueue};
