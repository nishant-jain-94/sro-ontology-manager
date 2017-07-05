const conceptAck = require('./concept.ack');
const conceptStream = require('./concept.consumer');
const conceptProcessor = require('./concept.processor');

conceptStream.pipe(conceptProcessor).each(conceptAck);