const should = require('should');
const sroUtils = require('./index');

describe('SRO Utils', () => {
  it('Should have doesPropertyExists', (done) => {
    should.exist(sroUtils.doesPropertyExists);
    done();
  });

  it('Should have getDirectories', (done) => {
    should.exist(sroUtils.getDirectories);
    done();
  });

  it('Should have logger', (done) => {
    should.exist(sroUtils.logger);
    done();
  });

  it('Should have normalize', (done) => {
    should.exist(sroUtils.normalize);
    done();
  });
});
