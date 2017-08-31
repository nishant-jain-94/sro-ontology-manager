require('should');
const async = require('async');
const highland = require('highland');
const log = require('../sro_utils/logger')('Node_Factory_Test');
const {
    queryExecutor,
    dropAllConstraints
} = require('../neo4j_utils');
const node_factory = require('./node.factory');

describe('Node Factory', () => {
    before((done) => {
        async.series([
            dropAllConstraints,
            queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
        ], done);
    });

    it("Should Create Nodes if it doesn't exists", (done) => {
        let nodes = [{
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

        const messageWrapper = (triples) => {
            return triples.map((triple) => {
                return {
                    content: new Buffer(JSON.stringify(triple))
                };
            });
        };
        highland([nodes]).map(messageWrapper).pipe(node_factory).each(({
            results
        }) => {
            log.debug({
                results: results
            })
            results.summary.counters._stats.nodesCreated.should.be.exactly(2);
            results.summary.counters._stats.labelsAdded.should.be.exactly(2);
            done();
        });
    });

    after((done) => {
        queryExecutor('MATCH (n) DETACH DELETE n', done);
    });
});