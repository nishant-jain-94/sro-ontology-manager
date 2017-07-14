const mediaContentAck = require('./media_content.ack');
const mediaContentStream = require('./media_content.consumer');
const mediaContentProcessor = require('./media_content.processor');

mediaContentStream.pipe(mediaContentProcessor).each(mediaContentAck);