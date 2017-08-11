const async = require('async');
const should = require('should');
const highland = require('highland');
const log = require('./sro_utils/logger')('Node_Factory_Test');
const {queryExecutor, getConstraint, dropAllConstraints} = require('./neo4j_utils');
const node_factory = require('./node.factory');

describe('Node Factory', (done) => {
    before((done) => {
        async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
		], done);
    });

    it("Should Create Nodes if it doesn't exists", (done) => {
        let nodes = [
            {
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
               return { content: new Buffer(JSON.stringify(triple)) };
           });
       };
       const start = Date.now();
        highland([nodes]).map(messageWrapper).pipe(node_factory).each(({results}) => {
            log.debug({results: results})
            const record = results[0].records[0];
            record.length.should.be.exactly(1);
            record._fields[0].properties.importance.should.be.exactly('high');
            record._fields[0].properties.domain.should.be.exactly('frontend');
            record._fields[0].properties.name.should.be.exactly('AngularJS');
            record._fields[0].labels[0].should.be.exactly('concept');
            const stop = Date.now();
            log.debug("Total Time", stop - start);
            done();
        });       
    });

    after((done) => {
		queryExecutor('MATCH (n) DETACH DELETE n', done);
	});
});