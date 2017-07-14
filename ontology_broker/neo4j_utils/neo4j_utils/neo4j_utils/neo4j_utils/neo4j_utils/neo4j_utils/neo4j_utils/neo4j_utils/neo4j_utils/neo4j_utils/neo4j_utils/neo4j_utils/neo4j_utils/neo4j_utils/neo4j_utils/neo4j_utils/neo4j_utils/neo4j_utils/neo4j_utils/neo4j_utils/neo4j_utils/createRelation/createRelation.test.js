const should = require('should');
const async = require('async');

const createNode = require('../createNode');
const createRelation = require('../createRelation');
const dropAllConstraints = require('../dropAllConstraints');
const queryExecutor = require('../queryExecutor');

const sourceNode = {label: 'concept', name: 'AngularJS', domain: 'frontend', level: 10, importance: 'high'};
const targetNode = {label: 'concept', name: 'MEANStack', domain: 'frontend', level: 10, importance: 'high'};


const relation = {
			nameOfSourceNode: 'AngularJS',
			labelOfSourceNode: 'concept',
			relation: 'subConceptOf',
			nameOfTargetNode: 'MEANStack',
			labelOfTargetNode: 'concept',
			isNecessary: true,
			importance: 'high'
		};

describe('Create Relations', () => {
	
	before((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
			], 
			done);
	});

	it('Should create relations', (done) => {
		async.series([
			createNode.bind(null, sourceNode),
			createNode.bind(null, targetNode),
			createRelation.bind(null, relation)
			], (error, [resultsOfCreateSourceNode, resultsOfCreateTargetNode, resultsOfCreateRelation]) => {
			
			should.not.exist(error);
			resultsOfCreateRelation.records.length.should.be.exactly(1);
			resultsOfCreateRelation.records[0].should.have.keys('keys', 'length', '_fields');
			resultsOfCreateRelation.records[0]._fields.length.should.be.exactly(1);
			resultsOfCreateRelation.records[0]._fields[0].type.should.be.exactly('subConceptOf');
			resultsOfCreateRelation.records[0]._fields[0].properties.should.have.keys('importance', 'isNecessary');
			resultsOfCreateRelation.records[0]._fields[0].properties.importance.should.be.exactly('high');
			resultsOfCreateRelation.records[0]._fields[0].properties.isNecessary.should.be.exactly(true);
			done();
		})
	});

	it('Should create unique relations', (done) => {
		createRelation(relation, (error, {records}) => {
			should.not.exist(error);
			records.length.should.be.exactly(1);
			records[0].length.should.be.exactly(1);
			records[0]._fields.length.should.be.exactly(1);
			records[0]._fields[0].type.should.be.exactly('subConceptOf');
			records[0]._fields[0].properties.should.have.keys('importance', 'isNecessary');
			records[0]._fields[0].properties.importance.should.be.exactly('high');
			records[0]._fields[0].properties.isNecessary.should.be.exactly(true);
			done();
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