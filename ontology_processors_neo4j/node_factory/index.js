const nodeAck = require('./node.ack');
const nodeStream = require('./node.consumer');
const nodeFactory = require('./node.factory');
const log = require('./sro_utils/logger');

nodeStream.pipe(nodeFactory).each(nodeAck);