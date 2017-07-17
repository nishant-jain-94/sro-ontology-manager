const mediaContentAck = require('./media_content.ack');
const mediaContentStream = require('./media_content.consumer');
const mediaContentProcessor = require('./media_content.processor');
const mediaContentRouter = require('./media_content.router');
const log = require('./sro_utils/logger');

mediaContentStream.pipe(mediaContentProcessor).pipe(mediaContentRouter).each(mediaContentAck);