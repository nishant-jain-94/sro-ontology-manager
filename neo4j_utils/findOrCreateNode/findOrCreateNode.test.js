const should = require('should');
const async = require('async');
const queryExecutor = require('../queryExecutor');
const createNode = require('../createNode');
const getConstraints = require('../getConstraints');
const dropAllConstraints = require('../dropAllConstraints');
const findOrCreateNode = require('../findOrCreateNode');

const node = {label: 'concept', name: 'AngularJS', domain: 'frontend', level: 10, importance: 'high'};

describe('FindOrCreateNode', () => {

    before((done) => {
        async.series([
            dropAllConstraints, 
            queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n'),
            createNode.bind(null, node)
            ], 
            done);
    });
    
    it("Should find the existing node and not trigger createNode when node exist", (done) => {
        findOrCreateNode(node, (error, {records}) => {
            should.not.exists(error);
			records.should.not.be.empty();
			records.length.should.be.exactly(1);
			records[0].should.have.keys('keys', 'length', '_fields');
			records[0].length.should.be.exactly(1);
			records[0]._fields.length.should.be.exactly(1);
			records[0]._fields[0].labels.should.not.be.empty();
			records[0]._fields[0].labels.length.should.be.exactly(1);
			records[0]._fields[0].labels[0].should.be.exactly('concept');
			records[0]._fields[0].properties.should.not.be.empty();
			records[0]._fields[0].properties.should.have.keys('level', 'importance', 'domain', 'name');
			let {level, importance, domain, name} = records[0]._fields[0].properties;
			level.low.should.exactly(10);
			importance.should.be.exactly('high');
			domain.should.be.exactly('frontend');
			name.should.be.exactly('AngularJS');
			done();
        });
    });

    it("Should trigger createNode when node doesn't exist", (done) => {
        const node = {label: 'concept', name: 'ReactJS', domain: 'frontend', level: 10, importance: 'high'};
        findOrCreateNode(node, (error, {records}) => {
            should.not.exists(error);
			records.should.not.be.empty();
			records.length.should.be.exactly(1);
			records[0].should.have.keys('keys', 'length', '_fields');
			records[0].length.should.be.exactly(1);
			records[0]._fields.length.should.be.exactly(1);
			records[0]._fields[0].labels.should.not.be.empty();
			records[0]._fields[0].labels.length.should.be.exactly(1);
			records[0]._fields[0].labels[0].should.be.exactly('concept');
			records[0]._fields[0].properties.should.not.be.empty();
			records[0]._fields[0].properties.should.have.keys('level', 'importance', 'domain', 'name');
			let {level, importance, domain, name} = records[0]._fields[0].properties;
			level.low.should.exactly(10);
			importance.should.be.exactly('high');
			domain.should.be.exactly('frontend');
			name.should.be.exactly('ReactJS');
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