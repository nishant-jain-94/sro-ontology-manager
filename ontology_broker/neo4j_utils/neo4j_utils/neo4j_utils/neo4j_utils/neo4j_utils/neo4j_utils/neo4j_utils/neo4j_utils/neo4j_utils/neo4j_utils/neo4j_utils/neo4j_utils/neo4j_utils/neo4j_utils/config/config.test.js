const should = require('should');
const config = require('./config');

describe('Neo4j Config', (done) => {
    it('Should have NEO4J_HOST', (done) => {
        should.exist(config.NEO4J_HOST);
        done();
    });

    it('Should have NEO4J_PORT', (done) => {
        should.exist(config.NEO4J_PORT);
        done();
    });

    it('Should have NEO4J_BOLT_PORT', (done) => {
        should.exist(config.NEO4J_PROTOCOL);
        done();
    });

    it('Should have NEO4J_PROTOCOL', (done) => {
        should.exist(config.NEO4J_USERNAME);
        done();
    });

    it('Should have NEO4J_USERNAME', (done) => {
        should.exist(config.NEO4J_USERNAME);
        done();
    });

    it('Should have NEO4J_PASSWORD', (done) => {
        should.exist(config.NEO4J_PASSWORD);
        done();
    });

    it('Should have NEO4J_BASE64_ENCODED_CREDENTIALS', (done) => {
        should.exist(config.NEO4J_BASE64_ENCODED_CREDENTIALS);
        done();
    });
});