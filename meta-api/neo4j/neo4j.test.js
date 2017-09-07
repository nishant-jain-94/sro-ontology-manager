const chai = require('chai');

const { expect } = chai;
const ioClient = require('socket.io-client');
const ioServer = require('socket.io').listen(3002);
require('./neo4j.io')(ioServer);
const app = require('../app');
const request = require('supertest');

const neo4jController = require('./neo4j.controller');

describe('Neo4j Health Status Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    neo4jController.getNeo4jStatus((err, data) => {
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

describe('Neo4j Data Controller Method', () => {
  let controllerData;

  beforeEach((done) => {
    neo4jController.getNeo4jData((err, data) => {
      if (!err) {
        controllerData = data[0].attributes;
        done();
      } else done(err);
    });
  });

  it('should return an array', () => {
    expect(controllerData).to.be.a('array');
  });

  it('should not return an empty array', () => {
    expect(controllerData).to.not.have.lengthOf(0);
  });
});

describe('Test for Neo4j routes', () => {
  describe('GET /neo4jHealthStatus', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/neo4jHealthStatus')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /neo4jData', () => {
    it('should return status 200 and have json response', (done) => {
      request(app)
        .get('/neo4jData')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});

describe('Test for socket events for Neo4j', () => {
  let clientSocket;

  beforeEach((done) => {
    // Setup
    clientSocket = ioClient.connect('http://localhost:3002', {
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

  it('should emit neo4jHealthStatus event', (done) => {
    clientSocket.on('neo4jHealthStatus', () => {
      done();
    });
  });

  it('should emit neo4jData event', (done) => {
    clientSocket.on('neo4jData', () => {
      done();
    });
  });
});
