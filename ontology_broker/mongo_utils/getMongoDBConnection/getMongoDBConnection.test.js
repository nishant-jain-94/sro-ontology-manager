const should = require('should');
const getConnection = require('./getMongoDBConnection');

describe('MongoDB Get Connection', () => {
  it('Should create Singleton connection', (done) => {
    getConnection('local', (err, connection) => {
      should.exist(connection);
      done();
    });
  });
});
