const getAMQPChannel = require('./getAMQPChannel');
const getAMQPConnection = require('./getAMQPConnection');
const sendToQueue = require('./sendToQueue');
const messageStreamFromQueue = require('./messageStreamFromQueue');
const assertQueue = require('./assertQueue');
const deleteQueue = require('./deleteQueue');
const config = require('./config');

module.exports = {assertQueue, config, deleteQueue, getAMQPChannel, getAMQPConnection, sendToQueue, messageStreamFromQueue};
