const async = require('async');
const should = require('should');
const highland = require('highland');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const relationFactory = require('./relation.factory');
const log = require('../commons/logger')('RELATION_FACTORY_TEST');

const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

const source = {
  properties: {
    label: 'conceptTest',
    name: 'Javascript',
    domain: 'frontend and backend',
    level: 10,
    importance: 'high'
  },
  options: {
    uniqueConstraintsOn: [
      'name'
    ]
  }
};

const target = {
  properties: {
    label: 'conceptTest',
    name: 'AngularJS',
    domain: 'frontend',
    level: 10,
    importance: 'high'
  },
  options: {
    uniqueConstraintsOn: [
      'name'
    ]
  }
};

describe('Merge or Create Relations', () => {
  before((done) => {
    async.series([
      neo4j.dropAllConstraints.bind(neo4j),
      neo4j.queryExecutor.bind(neo4j, 'MATCH (n) DETACH DELETE n'),
      neo4j.mergeOrCreateNode.bind(neo4j, source),
      neo4j.mergeOrCreateNode.bind(neo4j, target)
    ], done);
  });

  it("Should create realtions if it doesn't exists", (done) => {
    const triple = [{
      source: {
        properties: {
          label: 'conceptTest',
          name: 'Javascript'
        },
        options: {
          uniqueConstraintsOn: [
            'name'
          ]
        }
      },
      target: {
        properties: {
          label: 'conceptTest',
          name: 'AngularJS'
        },
        options: {
          uniqueConstraintsOn: [
            'name'
          ]
        }
      },
      relation: {
        properties: {
          relation: 'subConceptOf'
        },
        options: {
          uniqueConstraintsOn: [
            'relation'
          ]
        }
      }
    }, {
      source: {
        properties: {
          label: 'conceptTest',
          name: 'Javascript'
        },
        options: {
          uniqueConstraintsOn: [
            'name'
          ]
        }
      },
      target: {
        properties: {
          label: 'conceptTest',
          name: 'AngularJS'
        },
        options: {
          uniqueConstraintsOn: [
            'name'
          ]
        }
      },
      relation: {
        properties: {
          relation: 'subConceptOf',
          importance: 'high'
        },
        options: {
          uniqueConstraintsOn: [
            'relation'
          ]
        }
      }
    }];

    const messageWrapper = message => ({
      content: Buffer.from(JSON.stringify(message))
    });

    highland(triple)
      .map(messageWrapper)
      .through(relationFactory)
      .collect()
      .toArray((results) => {
        should.exist(results);
        log.debug({ resultsOfFirstTest: results });
        let result = results[0][0].results;
        results[0][0].results.records.length.should.be.exactly(1);
        let record = result.records[0];
        record.length.should.be.exactly(3);
        let [fieldsOfSource, fieldsOfTarget, fieldsOfRelation] = record._fields;
        fieldsOfSource.labels[0].should.be.exactly('conceptTest');
        fieldsOfTarget.labels[0].should.be.exactly('conceptTest');
        fieldsOfRelation.type.should.be.exactly('subConceptOf');
        fieldsOfSource.properties.name.should.be.exactly('Javascript');
        fieldsOfTarget.properties.name.should.be.exactly('AngularJS');

        // Should merge the properties of a relation if it already exists
        result = results[0][1].results;
        [record] = result.records;
        record.length.should.be.exactly(3);
        [fieldsOfSource, fieldsOfTarget, fieldsOfRelation] = record._fields;
        fieldsOfSource.labels[0].should.be.exactly('conceptTest');
        fieldsOfTarget.labels[0].should.be.exactly('conceptTest');
        fieldsOfRelation.type.should.be.exactly('subConceptOf');
        fieldsOfRelation.properties.importance.should.be.exactly('high');
        fieldsOfSource.properties.name.should.be.exactly('Javascript');
        fieldsOfTarget.properties.name.should.be.exactly('AngularJS');
        done();
      });
  });

  after((done) => {
    async.series([
      neo4j.dropAllConstraints.bind(neo4j),
      neo4j.queryExecutor.bind(neo4j, 'MATCH (n) DETACH DELETE n')
    ], done);
  });
});
