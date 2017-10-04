const chai = require('chai');

const { expect } = chai;
const ioClient = require('socket.io-client');
const ioServer = require('socket.io').listen(3003);
require('./rabbitmq.io')(ioServer);
const app = require('../app');
const request = require('supertest');

const rabbitmqController = require('./rabbitmq.controller');

describe('RabbitMQ Health Status Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    rabbitmqController.getHealthStatus((err, data) => {
      if (!err) {
        controllerData = data;
        done();
      } else done(err);
    });
  });

  it('should return an object', () => {
    expect(controllerData).to.be.a('object');
  });

  it('should have property \'status\'', () => {
    expect(controllerData).to.have.property('status');
  });
});

describe('RabbitMQ Get Number of Queues Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    rabbitmqController.getNoOfQueues((err, data) => {
      if (!err) {
        controllerData = data;
        done();
      } else done(err);
    });
  });

  it('should return an object', () => {
    expect(controllerData).to.be.a('object');
  });

  it('should have property \'count\'', () => {
    expect(controllerData).to.have.property('count');
  });
});

describe('RabbitMQ Get Number of Consumers Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    rabbitmqController.getNoOfConsumers((err, data) => {
      if (!err) {
        controllerData = data;
        done();
      } else done(err);
    });
  });

  it('should return an object', () => {
    expect(controllerData).to.be.a('object');
  });

  it('should have property \'count\'', () => {
    expect(controllerData).to.have.property('count');
  });
});

describe('RabbitMQ Get Consumer Utilization Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    rabbitmqController.getConsumerUtilisation((err, data) => {
      if (!err) {
        controllerData = data;
        done();
      } else done(err);
    });
  });

  it('should return an array', () => {
    expect(controllerData).to.be.a('array');
  });
});

describe('Test for RabbitMQ routes', () => {
  describe('GET /noOfQueues', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/noOfQueues')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /healthStatus', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/healthStatus')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /noOfConsumers', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/noOfConsumers')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /consumerUtilisation', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/consumerUtilisation')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

describe('Test for rabbitmq sockets', () => {
  let clientSocket;

  beforeEach((done) => {
    // Setup
    clientSocket = ioClient.connect('http://localhost:3003', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
    });

    clientSocket.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
      done();
    }
  });


  it('should emit queues event', (done) => {
    clientSocket.on('queues', () => {
      done();
    });
  });

  it('should emit consumerUtilization event', (done) => {
    clientSocket.on('consumerUtilization', () => {
      done();
    });
  });

  it('should emit healthStatus event', (done) => {
    clientSocket.on('healthStatus', () => {
      done();
    });
  });

  it('should emit consumers event', (done) => {
    clientSocket.on('consumers', () => {
      done();
    });
  });
});
