const should = require('should');
const async = require('async');
const dropAllConstraints = require('../dropAllConstraints');
const queryExecutor = require('../queryExecutor');

const {createNodesFromCsv, createRelationsFromCsv} = require('./createNodesAndRelationsFromCsv');

describe('Create Nodes and Relations from CSV', () => {
	before((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
		], done);
	});

	it('Should create nodes from the supplied csv file', (done) => {
		createNodesFromCsv('./conceptNodes.test.csv', done);
	});

	it('should create relations from the supplied csv file', (done) => {
		createRelationsFromCsv('./conceptRelations.test.csv', done);
	});

	after((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
		], done);
	});
});