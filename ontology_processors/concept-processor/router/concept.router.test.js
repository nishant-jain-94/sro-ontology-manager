require('should');
const highland = require('highland');
const conceptRouter = require('./concept.router.js');
const AmqpLib = require('simple-amqplib-wrapper');

const amqp = new AmqpLib(process.env.AMQP_URL);

const mockData = {
  source: {
    properties: {
      label: 'concept',
      name: 'nameOfTestConcept',
      displayName: 'displayNameOfTestConcept',
      identifier: 'identifierOfTestConcept'
    },
    options: {
      uniqueConstraintsOn: [
        'name'
      ]
    }
  },
  target: {
    properties: {
      label: 'concept',
      name: 'nameOfTestConcept',
      displayName: 'displayNameOfTestConcept',
      identifier: 'identifierOfTestConcept'
    },
    options: {
      uniqueConstraintsOn: [
        'name'
      ]
    }
  }
};


describe('Concept Router', () => {
  before(async () => {
    await amqp.assertQueue('node_factory', { durable: true });
  });

  it('Should send message to node and relation factory', (done) => {
    highland([{ triples: [mockData] }]).pipe(conceptRouter).done(() => {
      amqp.consumeStream('node_factory', { noAck: false }).take(2).each((message) => {
        message.should.have.property('fields').which.is.an.Object();
        message.should.have.property('properties').which.is.an.Object();
        message.should.have.property('content');
      }).done(done);
    });
  });

  after(async () => {
    await amqp.deleteQueue('node_factory');
  });
});
