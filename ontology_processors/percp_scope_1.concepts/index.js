const conceptAck = require('./concept.ack');
const conceptStream = require('./concept.consumer');
const conceptProcessor = require('./concept.processor');
const conceptRouter = require('./concept.router');
const log = require('./sro_utils/logger');

conceptStream.pipe(conceptProcessor).pipe(conceptRouter).each(conceptAck);