var ioClient = require('socket.io-client'),
    ioServer = require('socket.io').listen(3001);
    rabbitmqio = require('../io/rabbitmq.io')(ioServer);
    neo4jio = require('../io/neo4j.io')(ioServer);
    chai = require('chai'),
    expect = chai.expect;



    describe('Test for sockets', function() {
        var socket;

        beforeEach((done) => {
            // Setup
            clientSocket = ioClient.connect('http://localhost:3001', {
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


        it('should emit queues event', function(done) {
            clientSocket.on('queues', (message) => {
                done();
            });
        });

        it('should emit consumerUtilization event', function(done) {
            clientSocket.on('consumerUtilization', (message) => {
                done();
            });
        });

        it('should emit healthStatus event', function(done) {
            clientSocket.on('healthStatus', (message) => {
                done();
            });
        });

        it('should emit consumers event', function(done) {
            clientSocket.on('consumers', (message) => {
                done();
            });
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
