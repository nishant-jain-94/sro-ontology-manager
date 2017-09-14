module.exports = {
  NEO4J_URL: process.env.NEO4J_URL || 'bolt://localhost',
  NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost'
};
