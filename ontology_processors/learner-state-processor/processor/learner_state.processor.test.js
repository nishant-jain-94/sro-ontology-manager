require('should');
const _ = require('lodash');
const highland = require('highland');
const log = require('../commons/logger')('./learner_state.processor.mock');
const learnerState = require('./learner_state.processor.mock');
const learnerStateProcessor = require('./learner_state.processor');

describe('Create Learner State from Stream', () => {
  it('Should create Learner State from the stream', (done) => {
    log.debug('Inside Learner State Processor');

    const messageWrapper = message => ({
      content: Buffer.from(JSON.stringify(message))
    });

    highland([learnerState])
      .map(messageWrapper)
      .pipe(learnerStateProcessor)
      .collect()
      .toArray((s) => {
        const results = _.flatten(s);
        results[0].triples.length.should.be.exactly(4);
        results[0].triples[0].source.properties.label.should.be.exactly('user');
        results[0].triples[0].source.properties.identifier.should.be.exactly('amishag');
        results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[0].target.properties.label.should.be.exactly('resource');
        results[0].triples[0].target.properties.resourceId.should.be.exactly('info:fedora/learning:2584');
        results[0].triples[0].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[0].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
        results[0].triples[0].relation.properties.relation.should.be.exactly('yetToStart');

        results[0].triples[1].source.properties.label.should.be.exactly('user');
        results[0].triples[1].source.properties.identifier.should.be.exactly('amishag');
        results[0].triples[1].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[1].target.properties.label.should.be.exactly('resource');
        results[0].triples[1].target.properties.resourceId.should.be.exactly('info:fedora/learning:7321');
        results[0].triples[1].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[1].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
        results[0].triples[1].relation.properties.relation.should.be.exactly('completed');

        results[0].triples[2].source.properties.label.should.be.exactly('user');
        results[0].triples[2].source.properties.identifier.should.be.exactly('amishag');
        results[0].triples[2].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[2].target.properties.label.should.be.exactly('resource');
        results[0].triples[2].target.properties.resourceId.should.be.exactly('info:fedora/learning:7321');
        results[0].triples[2].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[2].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
        results[0].triples[2].relation.properties.relation.should.be.exactly('started');

        done();
      });
  });
});
