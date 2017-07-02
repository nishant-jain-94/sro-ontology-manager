const _ = require('lodash');
const async = require('async');
const should = require('should');

const log = require('../../util/logger');
const queryExecutor = require('../queryExecutor');
const dropAllConstraints = require('../dropAllConstraints');
const createNodesAndRelationsFromTriples = require('./createNodesAndRelationsFromTriples');

describe('Nodes and Relations from Triples', () => {

    before((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
			], 
			done);
	});
    
    it('Should create Nodes and Relations from Relations', (done) => {
        const triples = [
            {
                propertiesOfSubject: {
                    label: 'concept',
                    name: 'AngularJS'
                },
                propertiesOfObject: {
                    label: 'concept',
                    name: 'TwoWayBinding'
                },
                propertiesOfPredicate: {
                    relation: 'subConceptOf'
                }
            }
        ];

        createNodesAndRelationsFromTriples(triples, (err, data) => {
            should.not.exist(err);
            should.exist(data);
            const [subject, object, predicate] = _.flattenDeep(data);
            subject.summary.counters._stats.nodesCreated.should.be.exactly(1);
            subject.summary.counters._stats.labelsAdded.should.be.exactly(1);
            subject.records[0]._fields[0].labels[0].should.be.exactly('concept');
            subject.records[0]._fields[0].properties.name.should.be.exactly('AngularJS');
            object.summary.counters._stats.nodesCreated.should.be.exactly(1);
            object.summary.counters._stats.labelsAdded.should.be.exactly(1);
            object.records[0]._fields[0].labels[0].should.be.exactly('concept');
            object.records[0]._fields[0].properties.name.should.be.exactly('TwoWayBinding');
            predicate.records[0]._fields[0].type.should.be.exactly('subConceptOf');
            predicate.summary.counters._stats.relationshipsCreated.should.be.exactly(1);    
            done(err, data);
        });
    });

    after((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
			], 
			done);
	});

});