// # RabbitMQ Conttroller

// ## rabbitmq.controller.js

// The controller methods which are used by routes and sockets
// to fetch data from RabbitMQ HTTP API endpoints

// Imports the required dependencies
const request = require('request');
const config = require('../config');

// Declaring a controller object
const controller = {};

// `getNoOfQueues` Get the number of queues by making an API call
//  to the running instance of RabbitMQ
controller.getNoOfQueues = (cb) => {
  request.get(`${config.rabbitMQconfig.url}queues`, config.rabbitMQconfig.auth, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const data = { count: JSON.parse(body).length };
      cb(null, data);
    } else {
      cb(err, null);
    }
  });
};

// `getHealthStatus` Get the health status of RabbitMQ by making an API
// call to the running instance of RabbitMQ
controller.getHealthStatus = (cb) => {
  request.get(`${config.rabbitMQconfig.url}healthchecks/node`, config.rabbitMQconfig.auth, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const data = JSON.parse(body);
      cb(null, data);
    } else {
      cb(err, null);
    }
  });
};

// `getNoOfConsumers` Get the number of consumers by making an API
// call to the running instance of RabbitMQ
controller.getNoOfConsumers = (cb) => {
  request.get(`${config.rabbitMQconfig.url}consumers`, config.rabbitMQconfig.auth, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const data = { count: JSON.parse(body).length };
      cb(null, data);
    } else {
      cb(err, null);
    }
  });
};

// `getConsumerUtilisation` Get the consumerUtilisation of each queue and
// other related data by making an API call to the running instance of RabbitMQ
controller.getConsumerUtilisation = (cb) => {
  request.get(`${config.rabbitMQconfig.url}queues`, config.rabbitMQconfig.auth, (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const data = JSON.parse(body);
      cb(null, data);
    } else {
      cb(err, null);
    }
  });
};

// Exports the RabbitMQ controller object containing the methods
module.exports = controller;
