require('should');
const highland = require('highland');
const log = require('../commons/logger')('USER_PROCESSOR_TEST_JS');
const userProcessor = require('./user.processor');
const users = require('./user.processor.mock.js');


describe('Create User Nodes from Stream', () => {
  it('Should create user nodes from the stream', (done) => {
    const messageWrapper = user => ({
      content: Buffer.from(JSON.stringify(user))
    });

    highland(users)
      .map(messageWrapper)
      .pipe(userProcessor)
      .collect()
      .toArray((s) => {
        const { triples } = s[0][0];
        log.debug('User');
        log.debug(triples[0]);
        triples[0].source.properties.label.should.be.exactly('user');
        triples[0].source.properties.userType.should.be.exactly('student');
        triples[0].source.properties.identifier.should.be.exactly('bathriv');
        triples[0].source.properties.uniqueId.should.be.exactly('bathri.v93@wipro.com');
        triples[0].source.properties.displayName.should.be.exactly('bathri_v');
        triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('uniqueId');
        done();
      });
  });
});
