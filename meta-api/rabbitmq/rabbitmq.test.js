var chai = require('chai');
var expect = chai.expect;
var ioClient = require('socket.io-client');
var ioServer = require('socket.io').listen(3003);
var rabbitmqio = require('./rabbitmq.io')(ioServer);

var rabbitmqController = require('./rabbitmq.controller');

describe('RabbitMQ Health Status Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        rabbitmqController.getHealthStatus((err, data) => {
            if(!err) {
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

describe('RabbitMQ Get Number of Queues Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        rabbitmqController.getNoOfQueues((err, data) => {
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

    it('should have property \'count\'', function() {
        expect(controllerData).to.have.property('count');
    });
});

describe('RabbitMQ Get Number of Consumers Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        rabbitmqController.getNoOfConsumers((err, data) => {
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

    it('should have property \'count\'', function() {
        expect(controllerData).to.have.property('count');
    });
});

describe('RabbitMQ Get Consumer Utilization Controller Method', function() {
    var controllerData;

    beforeEach((done) => {
        rabbitmqController.getConsumerUtilisation((err, data) => {
            if(!err){
                controllerData = data;
                done();
            }
            else done(err);
        });
    });

    it('should return an array', function() {
        expect(controllerData).to.be.a('array');
    });

});

describe('Test for rabbitmq sockets', function() {
    var socket;

    beforeEach((done) => {
        // Setup
        clientSocket = ioClient.connect('http://localhost:3003', {
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


});