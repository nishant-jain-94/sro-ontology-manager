const should = require('should');
const config = require('../config');
const getAMQPConnection = require('./getAMQPConnection');

describe('AMQP Connection', (done) => {
    it('Should have a createChannel function', (done) => {
        getAMQPConnection(config.AMQP_URL, (err, connection) => {
            should.not.exist(err);
            should.exist(connection);
            done();
        });
    });
});