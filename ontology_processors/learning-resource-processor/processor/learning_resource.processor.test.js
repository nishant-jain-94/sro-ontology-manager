require('should');
const _ = require('lodash');
const highland = require('highland');
const learningResource = require('./learning_resource.mock');
const learningResourceProcessor = require('./learning_resource.processor');

describe('Create conceptNodes from Stream', () => {
  it('Should create content nodes from the Learning Resource Stream', (done) => {
    const messageWrapper = message => ({
      content: Buffer.from(JSON.stringify(message))
    });

    highland([learningResource])
      .map(messageWrapper)
      .pipe(learningResourceProcessor)
      .collect()
      .toArray((s) => {
        const results = _.flatten(s);
        results[0].triples[0].source.properties.label.should.be.exactly('resource');
        results[0].triples[0].source.properties.resourceId.should.be.exactly('info:fedora/learning:5194');
        results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
        done();
      });
  });
});
