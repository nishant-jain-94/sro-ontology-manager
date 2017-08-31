var config = {};

const AMQP_HTTP_URL = process.env.AMQP_HTTP_URL || 'http://localhost:15672';
const NEO4J_HTTP_URL = process.env.NEO4J_HTTP_URL || 'http://localhost:7474';

config.rabbitMQconfig = {
    auth: {
        "auth": {
            "user": "guest",
            "pass": "guest"
        }
    },
    url: `${AMQP_HTTP_URL}/api/`
};

config.neo4jconfig = {
    auth: {
        "auth": {
            "user": "neo4j",
            "pass": "password"
        }
    },
    url: `${NEO4J_HTTP_URL}/db/manage/`
};

module.exports = config;