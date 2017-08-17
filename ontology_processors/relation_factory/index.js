const relationAck = require('./relation.ack');
const relationStream = require('./relation.consumer');
const relationFactory = require('./relation.factory');
// Uncomment this line to enable logging
// const log = require('./sro_utils/logger')('Relation_Factory_Index');

relationStream.pipe(relationFactory).each(relationAck);