const should = require('should');
const index = require('./index.js');

describe('AMQP UTILS', (done) => {
    it('Should have config', (done) => {
        should.exist(index.config);
        done();
    });

    it('Should have getAMQPChannel', (done) => {
        should.exist(index.getAMQPChannel);
        done();
    });

    it('Should have getAMQPConnection', (done) => {
        should.exist(index.getAMQPConnection);
        done();
    });

    it('Should have sendToQueue', (done) => {
        should.exist(index.sendToQueue);
        done();
    });
});