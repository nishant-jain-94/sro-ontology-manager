const should = require('should');
const async = require('async');
const queryExecutor = require('../queryExecutor');
const deleteAllNodes = require('../deleteAllNodes');
const createNode = require('../createNode');
const log = require('../sro_utils/logger');
const getCountOfAllNodes = require('./getCountOfAllNodes');

const node = {label: 'concept', name: 'AngularJS', domain: 'frontend', level: 10, importance: 'high'};
describe('Count of all Nodes', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            createNode.bind(null, node)
        ], done);
    });

    it('Should get count of all the nodes', (done) => {
        getCountOfAllNodes((err, result) => {
            should.not.exist(err);
            should.exist(result);
            result.records[0]._fieldLookup["count(n)"].should.be.exactly(0);
            done();
        });
    });

    after((done) => {
        deleteAllNodes(done);
    });

});