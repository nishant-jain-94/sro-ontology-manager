var config = {};

config.rabbitMQconfig = {
    auth: {
        "auth": {
            "user": "guest",
            "pass": "guest"
        }
    },
    url: 'http://localhost:15672/api/'
};

config.neo4jconfig = {
    auth: {
        "auth": {
            "user": "neo4j",
            "pass": "password"
        }
    },
    url: 'http://localhost:7474/db/manage/'
};

module.exports = config;