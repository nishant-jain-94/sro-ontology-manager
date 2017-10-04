require('should');
const async = require('async');
const highland = require('highland');
const nodeFactory = require('./node.factory');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const log = require('../commons/logger')('NODE_FACTORY_TEST');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);


describe('Node Factory', () => {
  before((done) => {
    async.series([
      neo4j.dropAllConstraints.bind(neo4j),
      neo4j.queryExecutor.bind(neo4j, 'MATCH (n) DETACH DELETE n')
    ], done);
  });

  it("Should Create Nodes if it doesn't exists", (done) => {
    const nodes = [{
      properties: {
        label: 'concept',
        name: 'AngularJS',
        domain: 'frontend',
        level: 10,
        importance: 'high'
      },
      options: {
        uniqueConstraintsOn: ['name']
      }
    },
    {
      properties: {
        label: 'concept',
        name: 'AngularJS1',
        domain: 'frontend',
        level: 10,
        importance: 'high'
      },
      options: {
        uniqueConstraintsOn: ['name']
      }
    }
    ];

    const messageWrapper = triples => triples.map(triple => ({
      content: Buffer.from(JSON.stringify(triple))
    }));
    highland([nodes]).map(messageWrapper).pipe(nodeFactory).each(({
      results
    }) => {
      log.debug({
        results
      });
      results.summary.counters._stats.nodesCreated.should.be.exactly(2);
      results.summary.counters._stats.labelsAdded.should.be.exactly(2);
      done();
    });
  });

  after((done) => {
    neo4j.queryExecutor('MATCH (n) DETACH DELETE n', done);
  });
});
