const should = require('should');
const async = require('async');
const queryExecutor = require('../queryExecutor');
const deleteAllNodes = require('./deleteAllNodes');
const getCountOfAllNodes = require('../getCountOfAllNodes');


describe('Delete All Nodes', (done) => {
    it('should delete all nodes', (done) =>  {
        async.series([
            deleteAllNodes,
            getCountOfAllNodes
        ], (err, result) => {
            should.not.exist(err);
            should.exist(result);
            result[1].records[0]._fieldLookup["count(n)"].should.be.exactly(0);
            done();
        });
    });
});