// # Configuration and Settings

// ## config.js

// This file stores the configuration details like username, password
// of RabbitMQ, Neo4j etc.

// Declaring a config object
const config = {};

// Assigning values to some constants
const AMQP_HTTP_URL = process.env.AMQP_HTTP_URL || 'http://localhost:15672';
const NEO4J_HTTP_URL = process.env.NEO4J_HTTP_URL || 'http://localhost:7474';

// RabbitMQ Configuration
config.rabbitMQconfig = {
  auth: {
    auth: {
      user: 'guest',
      pass: 'guest',
    },
  },
  url: `${AMQP_HTTP_URL}/api/`,
};

// Neo4j Configuration
config.neo4jconfig = {
  auth: {
    auth: {
      user: 'neo4j',
      pass: 'password',
    },
  },
  url: `${NEO4J_HTTP_URL}/db/manage/`,
};

// Exporting the config object
module.exports = config;
