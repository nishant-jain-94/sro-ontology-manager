const should = require('should');
const config = require('./config');

describe('Mongo Util', () => {
  it('Should have MongoDB Url', (done) => {
    should.exist(config);
    should.exist(config.MONGODB_URL);
    done();
  });
});

