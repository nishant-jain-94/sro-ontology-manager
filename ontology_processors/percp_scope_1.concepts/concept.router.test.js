require('should');
const highland = require('highland');
const {assertQueue, messageStreamFromQueue, deleteQueue} = require('./amqp_utils');
const conceptRouter = require('./concept.router.js');

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
        assertQueue('AMQP_URL', 'node_factory', {durable: true}, done);
    });

    it('Should send message to node and relation factory', (done) => {
        highland([{triples: [mockData]}]).pipe(conceptRouter).done(() => {
            messageStreamFromQueue('AMQP_URL', 'node_factory').take(2).each((message) => {
                message.should.have.property('fields').which.is.an.Object();
                message.should.have.property('properties').which.is.an.Object();
                message.should.have.property('content');
            }).done(done);
        });
    });

    after((done) => {
        deleteQueue('AMQP_URL', 'node_factory', done);
    });
});