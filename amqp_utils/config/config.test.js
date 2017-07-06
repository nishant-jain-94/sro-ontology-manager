const should = require('should');
const config = require('./config');

describe('AMQP Config', (done) => {
    it('Should have AMQP URL', (done) => {
        should.exist(config.AMQP_URL);
        done();
    });
});
