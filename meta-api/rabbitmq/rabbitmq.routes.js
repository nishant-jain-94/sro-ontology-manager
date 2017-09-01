// # RabbitMQ Router

// ## rabbitmq.routes.js

// The routes used for API endpoints for RabbitMQ

// Imports the required dependencies
var express = require('express');
var router = express.Router();
var rabbitmqController = require('./rabbitmq.controller');

// GET `noOfQueues`
// To get the number of queues
router.get('/noOfQueues', function (req, res, next) {
    rabbitmqController.getNoOfQueues((err, data) => {
      if(!err) res.json(data);
      else next(err);
    });
})

// GET `healthStatus`
// To get the health status of RabbitMQ
router.get('/healthStatus', function (req, res, next) {
    rabbitmqController.getHealthStatus((err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
})

// GET `noOfConsumers`
// To get the number of consumers
router.get('/noOfConsumers', function (req, res, next) {
    rabbitmqController.getNoOfConsumers((err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

// GET `consumerUtilisation`
// To get the consumerUtilisation and other RabbitMQ data
router.get('/consumerUtilisation', function (req, res, next) {
    rabbitmqController.getConsumerUtilisation((err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

// Exporting the router
module.exports = router;
