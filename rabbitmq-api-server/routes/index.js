
var express = require('express');
var router = express.Router();
var controller = require('../controller');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/noOfQueues', function (req, res, next) {
  controller.getNoOfQueues(res);
})

router.get('/healthStatus', function (req, res, next) {
  controller.getHealthStatus(res);
})

router.get('/noOfConsumers', function (req, res, next) {
  controller.getNoOfConsumers(res);
});

router.get('/consumerUtilisation', function (req, res, next) {
  controller.getConsumerUtilisation(res);
});


module.exports = router;
