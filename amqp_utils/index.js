const getAMQPChannel = require('./getAMQPChannel');
const getAMQPConnection = require('./getAMQPConnection');
const sendToQueue = require('./sendToQueue');
const config = require('./config');

module.exports = {getAMQPChannel, getAMQPConnection, sendToQueue, config};
