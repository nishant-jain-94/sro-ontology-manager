var request = require('request');

var controller = {};

var config = require('../config');

controller.getNoOfQueues = (cb) => {

   request.get( config.rabbitMQconfig.url + 'queues', config.rabbitMQconfig.auth,(err, response, body) => {
       if(!err && response.statusCode == 200) {
            const data = {count: JSON.parse(body).length};
            cb(null,  data);
       } else {
            cb(err, null);
       }
   });

};

controller.getHealthStatus = (cb) => {

    request.get( config.rabbitMQconfig.url + 'healthchecks/node', config.rabbitMQconfig.auth,function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null, data);
        } else {
            cb(err, null);
        }
    });

};

controller.getNoOfConsumers = (cb) => {

    request.get( config.rabbitMQconfig.url + 'consumers', config.rabbitMQconfig.auth,function(err, response, body) {
        if(!err && response.statusCode == 200) {
            const data = { count: JSON.parse(body).length };
            cb(null, data);
        } else {
            cb(err, null);
        }
    });

};

controller.getConsumerUtilisation = (cb) => {

    request.get( config.rabbitMQconfig.url + 'queues', config.rabbitMQconfig.auth,(err, response, body) => {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null,  data);
        } else {
            cb(err, null);
        } 
    });

}

controller.getNeo4jStatus = (cb) => {

    request.get( config.neo4jconfig.url, config.neo4jconfig.auth, (err, response) => {
        if(!err && response.statusCode == 200) {
            const data = { status: 'OK' };
            cb(null, data);
        } else {
            cb(err, null);
        }
    });

}

controller.getNeo4jData = (cb) => {
    
    const urlString = 'server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DPrimitive%20count?_=1342719685294';

    request.get( config.neo4jconfig.url + urlString, config.neo4jconfig.auth, (err, response, body) => {
        if(!err && response.statusCode == 200) {
            const data = JSON.parse(body);
            cb(null, data);
        } else {
            cb(err, null);
        }
    });

}

module.exports = controller;