const should = require('should');
const getAMQPChannel = require('./getAMQPChannel');

describe('AMQP Channels', () => {
  it('Should create AMQP Channel', (done) => {
    getAMQPChannel('AMQP_URL', (err, channel) => {
      should.not.exist(err);
      should.exist(channel);
      done();
    });
  });
});
