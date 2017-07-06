const should = require('should');
const sro_utils = require('./index');

describe('SRO Utils', (done) => {
    it('Should have doesPropertyExists', (done) => {
        should.exist(sro_utils.doesPropertyExists);
        done();
    });

    it('Should have getDirectories', (done) => {
        should.exist(sro_utils.getDirectories);
        done();
    });

    it('Should have logger', (done) => {
        should.exist(sro_utils.logger);
        done();
    });

    it('Should have normalize', (done) => {
        should.exist(sro_utils.normalize);
        done();
    });
});