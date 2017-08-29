var express = require('express');
var router = express.Router();
var rabbitmqController = require('../controller/rabbitmq.controller');
var neo4jController = require('../controller/neo4j.controller');


router.get('/noOfQueues', function (req, res, next) {
  rabbitmqController.getNoOfQueues((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
})

router.get('/healthStatus', function (req, res, next) {
  rabbitmqController.getHealthStatus((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
})

router.get('/noOfConsumers', function (req, res, next) {
  rabbitmqController.getNoOfConsumers((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
});

router.get('/consumerUtilisation', function (req, res, next) {
  rabbitmqController.getConsumerUtilisation((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
});

router.get('/neo4jHealthStatus', function (req, res, next) {
  neo4jController.getNeo4jStatus((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
});

router.get('/neo4jData', function (req, res, next) {
  neo4jController.getNeo4jData((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
});


module.exports = router;
