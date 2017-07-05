const appConfig = {
    MONGODB_URL: 'mongodb://localhost' || process.env.MONGODB_URL,
    AMQP_URL: 'amqp://localhost' || process.env.AMQP_URL,
    NEO4J_HOST: 'localhost' || process.env.NEO4J_HOST,
    NEO4J_PORT: 7474 || process.env.NEO4J_PORT,
    NEO4J_BOLT_PORT: 7687 || process.env.NEO4J_BOLT_PORT,
    NEO4J_PROTOCOL: 'bolt' || process.env.NEO4J_PROTOCOL,
    NEO4J_USERNAME: 'neo4j' || process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: 'password' || process.env.NEO4J_PASSWORD,
    NEO4J_BASE64_ENCODED_CREDENTIALS: 'bmVvNGo6cGFzc3dvcmQ=' || process.env.NEO4J_BASE64_ENCODED_CREDENTIALS
};

module.exports = appConfig;