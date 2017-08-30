var chai = require('chai');
var expect = chai.expect;
process.env.NEO4J_HTTP_URL = 'http://localhost:7474';
process.env.AMQP_HTTP_URL = 'http://localhost:15672';
var rabbitmqController = require('../controller/rabbitmq.controller');
var neo4jController = require('../controller/neo4j.controller');

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