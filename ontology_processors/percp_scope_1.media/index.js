const mediaAck = require('./media.ack');
const mediaStream = require('./media.consumer');
const mediaProcessor = require('./media.processor');

mediaStream.pipe(mediaProcessor).each(mediaAck);