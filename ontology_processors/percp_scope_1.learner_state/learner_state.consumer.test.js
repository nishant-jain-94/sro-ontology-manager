require('should');
const async = require('async');
const {getAMQPChannel} = require('./amqp_utils');

const log = require('./sro_utils/logger')('Learner_State_Consumer');

const consumer = require('./learner_state.consumer');

const queue = 'learner_state';

const deleteQueue = (channel, callback) => {
    channel.deleteQueue(queue);        
    callback();
};


const assertQueue = (channel, callback) => channel.assertQueue(queue, {}, callback);

describe('Learner State Consumer', () => {

    before((done) => {
        async.waterfall([
            getAMQPChannel.bind(null, 'AMQP_URL'),
            deleteQueue,
            getAMQPChannel.bind(null, 'AMQP_URL'),
            assertQueue
        ], done);
    });

    it('Should consume message', (done) => {
        const testMessageForConsumer = JSON.stringify({message: "Hello Concepts"});
        
        const sendMessageToQueue = (channel, callback) => {
            channel.sendToQueue(queue, new Buffer(testMessageForConsumer));
            callback();
        };

        const readFromConsumer = (callback) => {
            consumer.each((data) => {
                if(data) {
                    if(data.content.toString() === testMessageForConsumer) {
                        log.debug("Consumed data exactly equal to sent data");
                        callback();
                    } else {
                        callback(new Error())
                    }
                }
            });
        };

        async.waterfall([
            getAMQPChannel.bind(null, 'AMQP_URL'),
            sendMessageToQueue,
            readFromConsumer
        ], done);
    });

    after((done) => {
        async.waterfall([
            getAMQPChannel.bind(null, 'AMQP_URL'),
            deleteQueue,
            getAMQPChannel.bind(null, 'AMQP_URL')
        ], done);
    });
});
