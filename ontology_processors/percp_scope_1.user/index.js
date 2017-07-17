const userAck = require('./media_content.ack');
const userStream = require('./media_content.consumer');
const userProcessor = require('./media_content.processor');
const userRouter = require('./media_content.router');
const log = require('./sro_utils/logger');

userStream.pipe(userProcessor).pipe(userRouter).each(userAck);