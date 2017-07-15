const neo4j_config = {
NEO4J_HOST: process.env.NEO4J_HOST || 'localhost',
    NEO4J_PORT: process.env.NEO4J_PORT || 7474,
    NEO4J_BOLT_PORT: process.env.NEO4J_BOLT_PORT || 7687,
    NEO4J_PROTOCOL: process.env.NEO4J_PROTOCOL || 'bolt',
    NEO4J_USERNAME: process.env.NEO4J_USERNAME || 'neo4j',
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || 'password',
    NEO4J_BASE64_ENCODED_CREDENTIALS: process.env.NEO4J_BASE64_ENCODED_CREDENTIALS || 'bmVvNGo6cGFzc3dvcmQ=' 
};

module.exports = neo4j_config;