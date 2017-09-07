require('should');
const async = require('async');
const {deleteQueue, sendToQueue} = require('../amqp_utils');

const log = require('../sro_utils/logger')('Node_Consumer_Test');

const consumer = require('./node.consumer');

const queue = 'node_factory';
const testMessageForConsumer = {message: 'Hello Concepts'};

describe('Node Factory Consumer', () => {
  before((done) => {
    async.series([
      deleteQueue.bind(null, 'AMQP_URL', 'node_factory'),
      sendToQueue.bind(null, {queue: queue, message: testMessageForConsumer}),
    ], done);
  });

  it('Should consume message', (done) => {
    consumer
      .each((data) => {
        if(data) {
          log.debug('Consuming Data.');
          if(data.content.toString() === JSON.stringify(testMessageForConsumer)) {
            done();
          } else {
            done(new Error());
          }
        }
      })
      .done();
  });

  after((done) => {
    deleteQueue('AMQP_URL', 'node_factory', done);
  });
});
