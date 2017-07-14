const userAck = require('./user.ack');
const userStream = require('./user.consumer');
const userProcessor = require('./user.processor');
const log = require('./sro_utils/logger');

userStream.pipe(userProcessor).each(userAck);