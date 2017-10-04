// # Neo4j Conttroller

// ## neo4j.controller.js

// The controller methods which are used by routes and sockets
// to fetch data from Neo4j HTTP API endpoints

// Imports the required dependencies
const request = require('request');
const config = require('../config');

// Declaring a controller object
const controller = {};

// `getNeo4jStatus` Get the health status of Neo4j by making an API
// call to the running instance of Neo4j
controller.getNeo4jStatus = (cb) => {
  request.get(config.neo4jconfig.url, config.neo4jconfig.auth, (err, response) => {
    if (!err && response.statusCode === 200) {
      const data = { status: 'OK' };
      cb(null, data);
    } else {
      cb(err, null);
    }
  });
};

// `getNeo4jData` Get the data about the number of nodes, relationships etc
// by making an API call to the running instance of Neo4j
controller.getNeo4jData = (cb) => {
  const urlString = 'server/jmx/domain/org.neo4j/instance%3Dkernel%230%2Cname%3DPrimitive%20count?_=1342719685294';
  const callback = (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const data = JSON.parse(body);
      cb(null, data);
    } else {
      cb(err, null);
    }
  };

  request.get(`${config.neo4jconfig.url}${urlString}`, config.neo4jconfig.auth, callback);
};

// Exports the Neo4j controller object containing the methods
module.exports = controller;
