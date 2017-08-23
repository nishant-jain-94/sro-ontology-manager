var request = require('request');

var controller = {};

var config = require('../config');

controller.getNoOfQueues = (cb) => {
   request.get('http://localhost:15672/api/queues', config.rabbitMQconfig,(err, response, body) => {
       if(!err && response.statusCode == 200) {
            const data = {count: JSON.parse(body).length};
            cb(null,  data);
       } else {
            cb(err, null);
       }
   });
};

controller.getHealthStatus = (cb) => {

    request.get('http://localhost:15672/api/healthchecks/node', config.rabbitMQconfig,function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null, data);
        } else {
            cb(err, null);
        }
    });

};

controller.getNoOfConsumers = (cb) => {

    request.get('http://localhost:15672/api/consumers', config.rabbitMQconfig,function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = { count: JSON.parse(body).length };
            cb(null, data);
        } else {
            cb(err, null);
        }

    });

};

controller.getConsumerUtilisation = (cb) => {

    request.get('http://localhost:15672/api/queues', config.rabbitMQconfig,(err, response, body) => {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null,  data);
        } else {
            cb(err, null);
        }
        
    });

}



module.exports = controller;