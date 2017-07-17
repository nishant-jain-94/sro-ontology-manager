const learningResourceAck = require('./learning_resource.ack');
const learningResourceStream = require('./concept.consumer');
const learningResourceProcessor = require('./concept.processor');
const learningResourceRouter = require('./concept.router');
const log = require('./sro_utils/logger');

learningResourceStream.pipe(learningResourceProcessor).pipe(learningResourceRouter).each(learningResourceAck);