const request = require('supertest');
const should = require('should');
const proxyquire = require('proxyquire');
const {
  mediaContent, listOfConcepts, listOfSubConcepts, listOfRelatedContents, relatedEntities,
} = require('./concept.mock.js');

const conceptRoutes = proxyquire('./concept.router.js', {
  './concept.controller.js': {
    fetchAllTheContentsWhichExplainsThisConcept(concept, cb) {
      cb(null, mediaContent);
    },
    fetchAllConcepts(options, cb) {
      cb(null, listOfConcepts);
    },
    fetchAllTheSubConcepts(concept, options, cb) {
      cb(null, listOfSubConcepts);
    },
    fetchAllTheAssociatedContents(concept, options, cb) {
      cb(null, listOfRelatedContents);
    },
    fetchAllRelatedItems(concept, options, cb) {
      cb(null, relatedEntities);
    },
  },
});

const app = proxyquire('../app', {
  './concept.routes.js': conceptRoutes,
});


describe('POST /private/v1/concept/content', () => {
  const contentRequest = {
    conceptId: 'info:fedora/learning:12162', courseId: 'info:fedora/learning:14243', offset: 0, limit: 20,
  };

  it('Should Fetch all the content matching the conceptId in the request object', (done) => {
    request(app)
      .post('/private/v1/concept/content')
      .type('form')
      .send(contentRequest)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.length.should.be.exactly(2);
        res.body[0].identifier.should.be.exactly('info:fedora/learning:24966');
        res.body[1].identifier.should.be.exactly('info:fedora/learning:25258');
        done();
      });
  });
});

describe('GET /', () => {
  it('Should fetch all the concepts', (done) => {
    request(app)
      .get('/concepts/')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.be.instanceOf(Array).and.have.lengthOf(7);
        res.body.forEach((concept) => {
          concept.should.have.property('identifier').which.is.a.String();
          concept.should.have.property('displayName').which.is.a.String();
          concept.should.have.property('name').which.is.a.String();
        });
        done();
      });
  });
});

describe('GET /:conceptId/contents', () => {
  it('Should fetch all the related contents to a conceptId', (done) => {
    request(app)
      .get('/concepts/info%3Afedora%2Flearning%3A12162/contents')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.be.instanceOf(Array).and.have.lengthOf(6);
        res.body.forEach((content) => {
          content.should.have.property('mongoId').which.is.a.String();
          content.should.have.property('mediaContentId').which.is.a.String();
          content.should.have.property('displayName').which.is.a.String();
          content.should.have.property('contentSubType').which.is.a.String();
        });
        done();
      });
  });
});

describe('GET /:conceptId/subconcepts', () => {
  it('Should fetch all the subconcepts', (done) => {
    request(app)
      .get('/concepts/info%3Afedora%2Flearning%3A12162/subconcepts')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.be.instanceOf(Array);
        res.body.forEach((concept) => {
          concept.should.have.property('identifier').which.is.a.String();
          concept.should.have.property('displayName').which.is.a.String();
          concept.should.have.property('name').which.is.a.String();
        });
        done();
      });
  });
});

describe('GET /:conceptId/details', () => {
  it('Should fetch all the related details about concepts', (done) => {
    request(app)
      .get('/concepts/info%3Afedora%2Flearning%3A12162/details')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err);
        should.exist(res);
        res.body.should.have.property('entityId').which.is.a.String();
        res.body.should.have.property('entityType').which.is.a.String();
        res.body.should.have.property('entityName').which.is.a.String();
        res.body.should.have.property('relatedGroups').which.is.a.instanceOf(Array);
        res.body.relatedGroups.forEach((group) => {
          group.should.have.property('name').which.is.a.String();
          group.should.have.property('entities').which.is.a.instanceOf(Array);
          group.entities.forEach((entity) => {
            entity.entityId.should.be.instanceOf(String);
            entity.entityType.should.be.instanceOf(String);
            entity.entityName.should.be.instanceOf(String);
          });
        });
      });
    done();
  });
});
