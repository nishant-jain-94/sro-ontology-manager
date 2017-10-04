const should = require('should');
const highland = require('highland');
const concepts = require('./concept.processor');
const conceptOplogs = require('./concept.processor.mock.js');
const log = require('../commons/logger')('Concept_Processor_Test');

describe('Create conceptNodes from Stream', () => {
  it('Should create concept nodes from the stream', (done) => {
    log.debug('Should create concept nodes from stream');

    const messageWrapper = oplog => ({
      content: Buffer.from(JSON.stringify(oplog.o))
    });

    highland(conceptOplogs)
      .map(messageWrapper)
      .pipe(concepts)
      .collect()
      .toArray((s) => {
        should.exist(s);
        const results = s[0];
        results.length.should.be.exactly(4);
        results[0].triples.length.should.be.exactly(1);
        results[1].triples.length.should.be.exactly(1);
        results[2].triples.length.should.be.exactly(3);
        results[3].triples.length.should.be.exactly(1);
        done();
      });
  });
});
