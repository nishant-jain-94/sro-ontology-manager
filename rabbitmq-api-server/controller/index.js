var request = require('request');

var controller = {};

controller.getNoOfQueues = (cb) => {
   request.get('http://localhost:15672/api/queues', (err, response, body) => {
       if(!err && response.statusCode == 200) {
        const data = {count: JSON.parse(body).length};
        cb(null,  data);
       } else {
           cb(err, null);
       }
   }).auth('guest', 'guest', false);
};

controller.getHealthStatus = (cb) => {

    request.get('http://localhost:15672/api/healthchecks/node', function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null, data);
        } else {
            cb(err, null);
        }
    }).auth('guest','guest',false);

};

controller.getNoOfConsumers = (cb) => {

    request.get('http://localhost:15672/api/consumers', function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = { count: JSON.parse(body).length };
            cb(null, data);
        } else {
            cb(err, null);
        }

    }).auth('guest','guest', false);

};

controller.getConsumerUtilisation = (cb) => {

    request.get('http://localhost:15672/api/queues', (err, response, body) => {
        if(!err && response.statusCode == 200) {
         const data = JSON.parse(body);
         cb(null,  data);
        } else {
            cb(err, null);
        }
        
    }).auth('guest', 'guest', false);

}



module.exports = controller;