const nodeAck = require('./node.ack.js');
const {sendToQueue, assertQueue, deleteQueue, messageStreamFromQueue} = require('../amqp_utils');
const mockData = {
  message: {
    properties: {
      label: 'concept',
      name: 'nameOfTestConcept',
      displayName: 'displayNameOfTestConcept',
      identifier: 'identifierOfTestConcept',
    },
    options: {
      uniqueConstraintsOn: [
        'name',
      ],
    },
  },
  queue: 'node_factory',
};

describe('Node Acknowledger', () => {
  before((done) => {
    assertQueue('AMQP_URL', 'node_factory', {durable: true}, (err) => {
      if(!err) {
        sendToQueue(mockData);
        done();
      }
    });
  });

  it('Should acknowledge the rabbitmq about the processing of a message', (done) => {
    const wrapMessageInHeaders = (message) => {
      return {
        headers: [message],
      };
    };

    messageStreamFromQueue('AMQP_URL', 'node_factory')
      .take(1)
      .filter(message => Boolean(message))
      .map(wrapMessageInHeaders)
      .each(nodeAck)
      .done(done);
  });

  after((done) => {
    deleteQueue('AMQP_URL', 'node_factory', done);
  });
});
