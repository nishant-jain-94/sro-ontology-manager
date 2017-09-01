require('should');
const highland = require('highland');
const {assertQueue, messageStreamFromQueue, getAMQPChannel} = require('./amqp_utils');
const conceptRouter = require('./concept.router.js');
let recievedMessage;

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
    
    before((done) => {
        assertQueue('AMQP_URL', 'node_factory', {}, done);
    });

    it('Should send message to node and relation factory', (done) => {
        highland([{triples: [mockData]}]).pipe(conceptRouter).done(() => {
            messageStreamFromQueue('AMQP_URL', 'node_factory').each((message) => {
                message.should.have.property('fields').which.is.an.Object();
                message.should.have.property('properties').which.is.an.Object();
                message.should.have.property('content');
                recievedMessage = message;
                done();
            });
        });
    });

    after((done) => {
        getAMQPChannel('AMQP_URL', (err, channel) => {
            channel.ackAll();
            done();
        });
    });
});