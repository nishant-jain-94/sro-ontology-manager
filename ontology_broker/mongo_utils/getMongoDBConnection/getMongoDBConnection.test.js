const should = require('should');
const getConnection = require('./getConnection');

describe('MongoDB Get Connection', (done) => {
    it('Should create Singleton connection', (done) => {
        let connection = getConnection();
        should.exist(connection);
        done();
    });
});