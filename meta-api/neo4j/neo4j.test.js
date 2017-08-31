var chai = require('chai');
var expect = chai.expect;
var ioClient = require('socket.io-client');
var ioServer = require('socket.io').listen(3002);
var neo4jio = require('./neo4j.io')(ioServer);

var neo4jController = require('./neo4j.controller');

describe('Neo4j Health Status Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        neo4jController.getNeo4jStatus((err, data) => {
            if(!err){
                controllerData = data;
                done();
            }
            else done(err);
        });
    });

    it('should return an object', function() {
        expect(controllerData).to.be.a('object');
    });

    it('should have property \'status\'', function() {
        expect(controllerData).to.have.property('status');
    });
});

describe('Neo4j Data Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        neo4jController.getNeo4jData((err, data) => {
            if(!err) {
                controllerData = data[0].attributes;
                done();
            }
            else done(err);
        });
    });

    it('should return an array', function() {
        expect(controllerData).to.be.a('array');
    });

    it('should not return an empty array', function() {
        expect(controllerData).to.not.have.lengthOf(0);
    });
});

describe('Test for socket events for Neo4j', function() {
    var socket;

    beforeEach((done) => {
        // Setup
        clientSocket = ioClient.connect('http://localhost:3002', {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true
        });
        
        clientSocket.on('connect', () => {
            done();
        });
    });

    afterEach((done) => {
        if(clientSocket.connected) {
            clientSocket.disconnect();
            done();
        }
    });

    it('should emit neo4jHealthStatus event', function(done) {
        clientSocket.on('neo4jHealthStatus', (message) => {
            done();
        })
    });

    it('should emit neo4jData event', function(done) {
        clientSocket.on('neo4jData', (message) => {
            done();
        });
    });

});