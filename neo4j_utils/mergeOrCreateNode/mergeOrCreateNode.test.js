const async = require('async');
const should = require('should');

const log = require('../sro_utils/logger');
const queryExecutor = require('../queryExecutor');
const getConstraint = require('../getConstraints');
const mergeOrCreateNode = require('./mergeOrCreateNode');
const dropAllConstraints = require('../dropAllConstraints');

describe('Merge Or Create Nodes', (done) => {
    before((done) => {
        async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
		], done);
    });

    it("Should Create Nodes if it doesn't exists", (done) => {
        let node = {
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
        };
        mergeOrCreateNode(node, (err, results) => {
            const record = results.records[0];
            record.length.should.be.exactly(1);
            record._fields[0].properties.importance.should.be.exactly('high');
            record._fields[0].properties.domain.should.be.exactly('frontend');
            record._fields[0].properties.name.should.be.exactly('AngularJS');
            record._fields[0].labels[0].should.be.exactly('concept');
            done();
        });       
    });

    it("Should Update Node if it already exists", (done) => {
        let node = {
            properties: {
                label: 'concept', 
                name: 'AngularJSTest', 
                domain: 'frontend', 
                level: 10, 
                importance: 'high'
            },
            options: {
                uniqueConstraintsOn: ['name']
            }
        }

        let nodeWithPropertiesUpdated = {
            properties: {
                label: 'concept',
                name: 'AngularJSTest',
                domain: 'FrontEndProgramming',
                level: 8,
                importance: 'high'
            },
            options: {
                uniqueConstraintsOn: ['name']
            }
        };

        async.series([
            mergeOrCreateNode.bind(null, node),
            mergeOrCreateNode.bind(null, nodeWithPropertiesUpdated)
        ], (err, results) => {
            [resultOfFirstOperation, resultOfSecondOperation] = results;
            recordOfFirstOperation = resultOfFirstOperation.records[0];
            recordOfSecondOperation = resultOfSecondOperation.records[0];
            recordOfFirstOperation._fields[0].identity.low.should.be.exactly(recordOfSecondOperation._fields[0].identity.low);
            recordOfFirstOperation._fields[0].labels[0].should.be.exactly('concept');
            recordOfSecondOperation._fields[0].labels[0].should.be.exactly('concept');
            recordOfFirstOperation._fields[0].properties.name.should.be.exactly(recordOfSecondOperation._fields[0].properties.name);
            recordOfSecondOperation._fields[0].properties.domain.should.be.exactly('FrontEndProgramming');
            recordOfFirstOperation._fields[0].properties.domain.should.be.exactly('frontend');
            done();
        });
    });

    after((done) => {
		queryExecutor('MATCH (n) DETACH DELETE n', done);
	});
});