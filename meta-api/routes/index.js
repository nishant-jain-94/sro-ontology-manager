// # Main router object file

// ## index.js

// Aggregation of all routes

// Assigning routes to constants
const neo4jRoutes = require('../neo4j/neo4j.routes');
const rabbitmqRoutes = require('../rabbitmq/rabbitmq.routes');

// Exporting the routes as an object.
// This is imported in app.js
module.exports = {
  neo4j: neo4jRoutes,
  rabbitmq: rabbitmqRoutes,
};
