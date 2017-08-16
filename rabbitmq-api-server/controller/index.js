var request = require('request');

var controller = {};

controller.getNoOfQueues = (res) => {

   request.get('http://localhost:15672/api/queues', function(err, response, body) {
       if(!err && response.statusCode == 200) {
        res.json({count: JSON.parse(body).length});
       }
   }).auth('guest', 'guest', false);

};

controller.getHealthStatus = (res) => {

    request.get('http://localhost:15672/api/healthchecks/node', function(err, response, body) {
        if(!err && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
    }).auth('guest','guest',false);

};

controller.getNoOfConsumers = (res) => {

    request.get('http://localhost:15672/api/consumers', function(err, response, body) {
        if(!err && response.statusCode == 200) {
            res.json({ count: JSON.parse(body).length });
        }

    }).auth('guest','guest', false);

};

controller.getConsumerUtilisation = (res) => {

    request.get('http://localhost:15672/api/queues', function (err, response, body) {
        if(!err && response.statusCode == 200) {
            res.json(JSON.parse(body));
        }
        
    }).auth('guest', 'guest', false);

}



module.exports = controller;