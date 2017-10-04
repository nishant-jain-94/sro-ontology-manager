const _ = require('lodash');
const should = require('should');
const highland = require('highland');
const courseProcessor = require('./course.processor');
const courses = require('./course.processor.mock.js');

describe('Create courseNodes from Stream', () => {
  it('Should create course nodes from the stream', (done) => {
    const messageWrapper = message => ({
      content: Buffer.from(JSON.stringify(message))
    });

    highland(courses)
      .map(messageWrapper)
      .pipe(courseProcessor)
      .collect()
      .toArray((s) => {
        should.exist(s);
        const results = _.flatten(s);
        results[0].triples[0].source.properties.name.should.be.exactly(_.snakeCase('Full Stack ME(A/R)N Programmer'));
        results[0].triples[0].source.properties.label.should.be.exactly('course');
        results[0].triples[0].source.properties.courseId.should.be.exactly('info:fedora/learning:4693');
        results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
        results[0].triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('courseId');
        done();
      });
  });
});
