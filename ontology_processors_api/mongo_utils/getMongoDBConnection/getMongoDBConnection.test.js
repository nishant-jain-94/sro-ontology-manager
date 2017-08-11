const should = require('should');
const getConnection = require('./getMongoDBConnection');

describe('MongoDB Get Connection', (done) => {
    it('Should create Singleton connection', (done) => {
        let connection = getConnection('local', (err, connection) => {
            should.exist(connection);
            done();
        });
    });
});