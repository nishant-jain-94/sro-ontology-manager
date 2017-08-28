var config = {};

config.rabbitMQconfig = {
    auth: {
        "auth": {
            "user": "guest",
            "pass": "guest"
        }
    },
    url: `${process.env.AMQP_HTTP_URL}/api/`
};

config.neo4jconfig = {
    auth: {
        "auth": {
            "user": "neo4j",
            "pass": "password"
        }
    },
    url: `${process.env.NEO4J_HTTP_URL}/db/manage/`
};

module.exports = config;