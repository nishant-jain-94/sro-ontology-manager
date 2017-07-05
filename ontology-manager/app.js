const async = require('async');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');

const log = require('./util/logger');
const {MONGODB_URL} = require('./config')
const sendToQueue = require('./sendToQueue');
const getAMQPChannel = require('./getAMQPChannel');

const db = mongoose.connect(`${MONGODB_URL}/local`);
mongoose.connection.on('open', () => {
    const collection = mongoose.connection.db.collection('oplog.rs');
    const stream = collection.find({}, {
        tailable: true,
        awaitdata: true,
        numberOfRetries: 10
    }).stream();

    stream.on('data', (data) => {
        async.waterfall([
            getAMQPChannel.bind(null, 'AMQP_URL'),
            sendToQueue.bind(null, data)
        ]);
    });
});