const _ = require('lodash');
const { AMQP_URL } = require('./config');
const AmqpLib = require('simple-amqplib-wrapper');
const relationFactory = require('./factory');

const amqp = new AmqpLib(AMQP_URL);
const relationStream = amqp.consumeStream('relation_factory');
const relationAck = _.bind(amqp.acknowledge, amqp, _, true);

relationStream.pipe(relationFactory).map(message => message.header).each(relationAck);
