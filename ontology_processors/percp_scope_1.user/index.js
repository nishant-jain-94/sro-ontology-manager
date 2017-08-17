const userAck = require('./user.ack');
const userStream = require('./user.consumer');
const userProcessor = require('./user.processor');
const userRouter = require('./user.router');

userStream.pipe(userProcessor).pipe(userRouter).each(userAck);