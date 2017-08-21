var express = require('express');
var router = express.Router();
var controller = require('../controller');


router.get('/noOfQueues', function (req, res, next) {
  controller.getNoOfQueues((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
})

router.get('/healthStatus', function (req, res, next) {
  controller.getHealthStatus(res);
})

router.get('/noOfConsumers', function (req, res, next) {
  controller.getNoOfConsumers(res);
});

router.get('/consumerUtilisation', function (req, res, next) {
  controller.getConsumerUtilisation((err, data) => {
    if(!err) res.json(data);
    else next(err);
  });
});


module.exports = router;
