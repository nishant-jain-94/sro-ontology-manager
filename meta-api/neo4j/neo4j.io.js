// # Neo4j Socket methods

// ## neo4j.io.js

// The socket methods that emit the data returned by the controller
// at regular intervals (at an interval of 5 seconds).


// Importing the Neo4j Controller methods
const neo4jController = require('./neo4j.controller');


// `fetchNeo4jHealthStatus` Socket method that emits the Health Status of Neo4j
// every five seconds. If Neo4j instance is not running it emits a default value.
const fetchNeo4jHealthStatus = (socket) => {
  setInterval(() => {
    neo4jController.getNeo4jStatus((err, data) => {
      const defaultValue = { status: 'No Connection' };
      if (!err) {
        socket.emit('neo4jHealthStatus', data);
      } else {
        socket.emit('neo4jHealthStatus', defaultValue);
      }
    });
  }, 5000);
};

// `fetchNeo4jData` Socket method that emits Neo4j data
// every five seconds
const fetchNeo4jData = (socket) => {
  setInterval(() => {
    neo4jController.getNeo4jData((err, data) => {
      if (!err) { socket.emit('neo4jData', data[0].attributes); }
    });
  }, 5000);
};

// Listening for an incoming socket connection request upon which
// the socket methods are called
const neo4jio = (io) => {
  io.on('connection', (socket) => {
    fetchNeo4jHealthStatus(socket);
    fetchNeo4jData(socket);
  });
};

// Exporting the neo4jio socket method
module.exports = neo4jio;
