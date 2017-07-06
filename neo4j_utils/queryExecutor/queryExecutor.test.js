const should = require('should');
const async = require('async');
const dropAllConstraints = require('../dropAllConstraints');
const queryExecutor = require('./queryExecutor');

describe('Query Executor', () => {
    before((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
			], done);
	});

    it('Should exectue queries', (done) => {
        const query = "CREATE (n:test {name: 'test'}) return n";
        queryExecutor(query, (err, data) => {
            should.not.exist(err);
            should.exist(data);
            done();
        });
    });

    after((done) => {
		async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
			], done);
	});
});