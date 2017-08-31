var request = require('request');

var controller = {};

var config = require('../config');

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