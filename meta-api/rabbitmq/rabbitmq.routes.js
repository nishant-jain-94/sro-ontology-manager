var express = require('express');
var router = express.Router();
var rabbitmqController = require('./rabbitmq.controller');

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

module.exports = router;
