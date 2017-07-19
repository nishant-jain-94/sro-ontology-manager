const learningResourceAck = require('./learning_resource.ack');
const learningResourceStream = require('./learning_resource.consumer');
const learningResourceProcessor = require('./learning_resource.processor');
const learningResourceRouter = require('./learning_resource.router');
const log = require('./sro_utils/logger');

learningResourceStream.pipe(learningResourceProcessor).pipe(learningResourceRouter).each(learningResourceAck);