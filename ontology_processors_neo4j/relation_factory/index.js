const relationAck = require('./relation.ack');
const relationStream = require('./relation.consumer');
const relationFactory = require('./relation.factory');
const log = require('./sro_utils/logger');

relationStream.through(relationFactory).each(relationAck);