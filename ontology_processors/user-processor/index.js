const _ = require('lodash');
const { AMQP_URL } = require('./config');
const AmqpLib = require('simple-amqplib-wrapper');

const amqp = new AmqpLib(AMQP_URL);
const userAck = _.bind(amqp.acknowledge, amqp, _, true);
const userStream = amqp.consumeStream('user');
const userProcessor = require('./processor');
const userRouter = require('./router');

userStream.pipe(userProcessor).pipe(userRouter).map(message => message.header).each(userAck);
