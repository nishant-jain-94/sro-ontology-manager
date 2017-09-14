const should = require('should');
const highland = require('highland');
const media = require('./media_content.mock.js');
const mediaProcessor = require('./media_content.processor');

describe('Create Media Content Nodes from Stream', () => {
  it('Should Create Media Content Nodes from the Stream', (done) => {
    const messageWrapper = message => ({
      content: Buffer.from(JSON.stringify(message))
    });

    highland(media)
      .map(messageWrapper)
      .pipe(mediaProcessor)
      .collect()
      .toArray((s) => {
        s.length.should.be.exactly(1);
        should.exist(s[0][0].triples);

        if (s[0][0].triples[0]) {
          const { source, target, relation } = s[0][0].triples[0];
          source.properties.label.should.be.exactly('content');
          source.properties.displayName.should.be.exactly('Deleting Attributes');
          source.properties.contentType.should.be.exactly('lecture');
          source.properties.contentSubType.should.be.exactly('None');
          source.properties.mongoId.should.be.exactly('58e62ec370528b2f6c86b728');
          source.options.uniqueConstraintsOn[0].should.be.exactly('mediaContentId');
          target.properties.label.should.be.exactly('concept');
          target.properties.name.should.be.exactly('properties_in_javascript');
          target.properties.conceptId.should.be.exactly('info:fedora/learning:7177');
          target.options.uniqueConstraintsOn[0].should.be.exactly('name');
          relation.properties.relation.should.be.exactly('explains');
          relation.options.uniqueConstraintsOn[0].should.be.exactly('relation');
        }

        if (s[0][0].triples[1]) {
          const { source, target, relation } = s[0][0].triples[1];
          source.properties.label.should.be.exactly('content');
          source.properties.displayName.should.be.exactly('Deleting Attributes');
          source.properties.contentType.should.be.exactly('lecture');
          source.properties.contentSubType.should.be.exactly('None');
          source.properties.mongoId.should.be.exactly('58e62ec370528b2f6c86b728');
          source.options.uniqueConstraintsOn[0].should.be.exactly('mediaContentId');
          target.properties.label.should.be.exactly('course');
          target.properties.courseId.should.be.exactly('info:fedora/learning:4693');
          target.options.uniqueConstraintsOn[0].should.be.exactly('courseId');
          relation.properties.relation.should.be.exactly('usedIn');
          relation.options.uniqueConstraintsOn[0].should.be.exactly('relation');
        }
        done();
      });
  });
});
