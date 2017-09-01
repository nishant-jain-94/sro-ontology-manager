// # Main router object file

// ## index.js

// Aggregation of all routes

// Exporting the routes as an object.
// This is imported in app.js
module.exports = {
        neo4j: require('../neo4j/neo4j.routes'),
        rabbitmq: require('../rabbitmq/rabbitmq.routes')
};
