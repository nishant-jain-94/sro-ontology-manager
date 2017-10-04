const should = require('should');
const sinon = require('sinon');
const { listOfContents, listOfRelatedConcepts, relatedEntities } = require('./content.mock');

const contentController = require('./content.controller');


describe('Content Controller', () => {
  it('Should Fetch All Contents', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(contentController, 'executeQueryAndFetchResults').yields(null, listOfContents);
    contentController.fetchAllContents(options, (err, data) => {
      should.not.exist(err);
      should.exist(data);
      data.should.be.an.instanceof(Array);
      data.forEach((content) => {
        content.should.have.property('mongoId').which.is.a.String();
        content.should.have.property('mediaContentId').which.is.a.String();
        content.should.have.property('displayName').which.is.a.String();
        content.should.have.property('contentSubType').which.is.a.String();
      });
      stubbedExecuteQueryAndFetchResults.restore();
      done();
    });
  });

  it('Should Fetch Related Concepts', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(contentController, 'executeQueryAndFetchResults').yields(null, listOfRelatedConcepts);
    contentController.fetchRelatedConcepts('', options, (err, data) => {
      should.not.exist(err);
      should.exist(data);
      listOfRelatedConcepts.should.be.an.instanceof(Array);
      listOfRelatedConcepts.forEach((concept) => {
        concept.should.have.property('identifier').which.is.a.String();
        concept.should.have.property('displayName').which.is.a.String();
        concept.should.have.property('name').which.is.a.String();
      });
      stubbedExecuteQueryAndFetchResults.restore();
      done();
    });
  });

  it('Should Fetch Related Courses', (done) => {
    // Yet to put the actual test code.
    done();
  });

  it('Should Fetch All Related Items', (done) => {
    const stubbedExecuteQueryAndFetchResults = sinon.stub(contentController, 'executeQueryAndFetchResults').yields(null, relatedEntities);
    // Yet to put the actual test code.
    stubbedExecuteQueryAndFetchResults.restore();
    done();
  });
});
