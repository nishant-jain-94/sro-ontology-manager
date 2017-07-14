const should = require('should');
const index = require('./index.js');

describe('NEO4J UTILS', (done) => {
    it('Should have createNode', (done) => {
        should.exist(index.createNode);
        done();
    });

    it('Should have createNodesAndRelationFromCsv', (done) => {
        should.exist(index.createNodesAndRelationsFromCsv);
        done();
    });

    it('Should have createNodesAndRelationsFromTriples', (done) => {
        should.exist(index.createNodesAndRelationsFromTriples);
        done();
    });

    it('Should have createRelation', (done) => {
        should.exist(index.createRelation);
        done();
    });

    it('Should have createUniqueConstraintOnNode', (done) => {
        should.exist(index.createUniqueConstraintOnNode);
        done();
    });

    it('Should have deleteAllNodes', (done) => {
        should.exist(index.deleteAllNodes);
        done();
    });

    it('Should have dropAllConstraints', (done) => {
        should.exist(index.dropAllConstraints);
        done();
    });

    it('Should have findNodes', (done) => {
        should.exist(index.findNodes);
        done();
    });

    it('Should have findOrCreateNode', (done) => {
        should.exist(index.findOrCreateNode);
        done();
    });

    it('Should have getConstraints', (done) => {
        should.exist(index.getConstraints);
        done();
    });

    it('Should have getCountOfAllNodes', (done) => {
        should.exist(index.getCountOfAllNodes);
        done();
    });

    it('Should have mergeOrCreateNode', (done) => {
        should.exist(index.mergeOrCreateNode);
        done();
    });

    it('Should have mergeOrCreateRelation', (done) => {
        should.exist(index.mergeOrCreateRelation);
        done();
    });

    it('Should have queryExecutor', (done) => {
        should.exist(index.queryExecutor);
        done();
    });

    it('Should have config', (done) => {
        should.exist(index.config);
        done();
    });
});