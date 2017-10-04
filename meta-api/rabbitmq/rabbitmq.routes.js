// # RabbitMQ Router

// ## rabbitmq.routes.js

// The routes used for API endpoints for RabbitMQ

// Imports the required dependencies
const express = require('express');

const router = express.Router();
const rabbitmqController = require('./rabbitmq.controller');

// GET `noOfQueues`
// To get the number of queues
router.get('/noOfQueues', (req, res, next) => {
  rabbitmqController.getNoOfQueues((err, data) => {
    if (!err) res.json(data);
    else next(err);
  });
});

// GET `healthStatus`
// To get the health status of RabbitMQ
router.get('/healthStatus', (req, res, next) => {
  rabbitmqController.getHealthStatus((err, data) => {
    if (!err) res.json(data);
    else next(err);
  });
});

// GET `noOfConsumers`
// To get the number of consumers
router.get('/noOfConsumers', (req, res, next) => {
  rabbitmqController.getNoOfConsumers((err, data) => {
    if (!err) res.json(data);
    else next(err);
  });
});

// GET `consumerUtilisation`
// To get the consumerUtilisation and other RabbitMQ data
router.get('/consumerUtilisation', (req, res, next) => {
  rabbitmqController.getConsumerUtilisation((err, data) => {
    if (!err) res.json(data);
    else next(err);
  });
});

// Exporting the router
module.exports = router;
