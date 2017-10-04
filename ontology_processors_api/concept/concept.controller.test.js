const should = require('should');
const async = require('async');
const sinon = require('sinon');
const log = require('../commons/logger');
const { getMongoDBConnection } = require('../mongo_utils');
const conceptController = require('./concept.controller');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const {
  listOfConcepts, listOfRelatedContents, listOfSubConcepts, mediaContent,
} = require('./concept.mock.js');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

const triple = {
  propertiesOfSubject: {
    label: 'content',
    name: 'Component-based software engineering',
    contentId: 'info:fedora/learning:24966',
  },
  propertiesOfObject: {
    label: 'concept',
    name: 'Quality Engineering',
    conceptId: 'info:fedora/learning:12162',
  },
  propertiesOfPredicate: {
    relation: 'explains',
  },
};


const createMediaContentInMongoDB = (content, cb) => {
  getMongoDBConnection('percp_scope_1', (err, db) => {
    db.collection('media_content').insert(content, cb);
  });
};

const deleteMediaContentFromMongoDB = (content, cb) => {
  getMongoDBConnection('percp_scope_1', (err, db) => {
    db.collection('media_content').remove({ identifier: content.identifier }, cb);
  });
};


describe('Concept Controller', () => {
  before((done) => {
    async.series([
      neo4j.dropAllConstraints.bind(neo4j),
      neo4j.queryExecutor.bind(neo4j, 'MATCH (n) DETACH DELETE n'),
      deleteMediaContentFromMongoDB.bind(null, mediaContent[0]),
      neo4j.createNodesAndRelationsFromTriple.bind(neo4j, triple),
      createMediaContentInMongoDB.bind(null, mediaContent[0]),
    ], done);
  });

  it('Should Fetch All Concepts', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(conceptController, 'executeQueryAndFetchResults').yields(null, listOfConcepts);
    conceptController.fetchAllConcepts(options, (err, data) => {
      should.not.exist(err);
      data.should.be.exactly(listOfConcepts);
      stubbedExecuteQueryAndFetchResults.restore();
      done();
    });
  });

  it('Should List All The Content Ids Which Explains This Concept', (done) => {
    const { conceptId } = triple.propertiesOfObject;

    conceptController
      .listAllTheContentIdsWhichExplainsThisConceptFromGraphDB(conceptId, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data[0].should.be.exactly('info:fedora/learning:24966');
        done();
      });
  });

  it('Should Find All The Content Matching a List Of Ids.', (done) => {
    conceptController.fetchAllTheContentsMatchingListOfContentIdsFromMongoDB(['info:fedora/learning:24966'], (err, data) => {
      should.not.exist(err);
      should.exist(data);
      data.length.should.be.exactly(1);
      data[0].name.should.be.exactly('Component-based software engineering');
      data[0].identifier.should.be.exactly('info:fedora/learning:24966');
      done();
    });
  });

  it('Should Find All The Content Documents Which Explains This Concept', (done) => {
    const { conceptId } = triple.propertiesOfObject;
    conceptController
      .fetchAllTheContentsWhichExplainsThisConceptFromMongoDB(conceptId, (err, data) => {
        should.not.exist(err);
        should.exist(data);
        data.length.should.be.exactly(1);
        data[0].name.should.be.exactly('Component-based software engineering');
        data[0].identifier.should.be.exactly('info:fedora/learning:24966');
        done();
      });
  });

  it('Should Fetch All The Associated Content', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(conceptController, 'executeQueryAndFetchResults').yields(null, listOfRelatedContents);
    conceptController.fetchAllTheAssociatedContents('', options, (err, data) => {
      should.not.exist(err);
      data.should.be.exactly(listOfRelatedContents);
      stubbedExecuteQueryAndFetchResults.restore();
      done();
    });
  });

  it('Should Fetch All The SubConcepts', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(conceptController, 'executeQueryAndFetchResults').yields(null, listOfSubConcepts);
    conceptController.fetchAllTheSubConcepts('', options, (err, data) => {
      should.not.exist(err);
      data.should.be.exactly(listOfSubConcepts);
      stubbedExecuteQueryAndFetchResults.restore();
      done();
    });
  });

  it('Should fetch all the relatedItems', (done) => {
    const options = {
      page: 1,
      limit: 20,
    };
    const stubbedExecuteQueryAndFetchResults = sinon.stub(conceptController, 'executeQueryAndFetchResults');
    const queryToFetchConceptById = 'MATCH (n:concept {identifier: "info:fedora/learning:12162"}) return n ORDER BY n.name SKIP 0 LIMIT 20';
    const queryToFetchAllSubConcepts = 'MATCH (n:concept {identifier: "info:fedora/learning:12162"})<-[:subconcept]-(m:concept) return m ORDER BY m.name SKIP 0 LIMIT 20';
    const queryToFetchAllTheAssociatedContents = 'MATCH (n:content)-[:explains]->(m:concept {identifier: "info:fedora/learning:12162"}) return n ORDER BY n.name SKIP 0 LIMIT 20';
    const resultToFetchConceptById = [mediaContent[0]];
    stubbedExecuteQueryAndFetchResults
      .withArgs(queryToFetchConceptById)
      .yields(null, resultToFetchConceptById);
    stubbedExecuteQueryAndFetchResults
      .withArgs(queryToFetchAllSubConcepts)
      .yields(null, listOfSubConcepts);
    stubbedExecuteQueryAndFetchResults
      .withArgs(queryToFetchAllTheAssociatedContents)
      .yields(null, listOfRelatedContents);
    conceptController.fetchAllRelatedItems('info:fedora/learning:12162', options, (err, results) => {
      should.not.exist(err);
      log.debug({ results });
      results.entityId.should.be.exactly('info:fedora/learning:24966');
      results.entityType.should.be.exactly('concepts');
      results.entityName.should.be.exactly('Component-based software engineering');
      results.relatedGroups.length.should.be.exactly(2);
      results.relatedGroups[0].should.have.property('name').which.is.a.String();
      results.relatedGroups[1].should.have.property('name').which.is.a.String();
      results.relatedGroups[0].should.have.property('entities').which.is.a.Array();
      done();
    });
  });

  after((done) => {
    async.series([
      neo4j.dropAllConstraints.bind(neo4j),
      neo4j.queryExecutor.bind(neo4j, 'MATCH (n) DETACH DELETE n'),
      deleteMediaContentFromMongoDB.bind(null, mediaContent[0]),
    ], done);
  });
});
