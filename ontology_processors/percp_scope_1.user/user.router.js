const _  = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const log = require('./sro_utils/logger');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

const routeUserToFactory = (data) => {
    const {triples} = data;

    const createNodeObjects = (triple) => {
        if(doesPropertyExists(triple, 'source.properties.uniqueId') && doesPropertyExists(triple, 'source.properties.identifier')) {
            const data = {
                message: triple.source,
                queue: 'node_factory'
            };
            sendToQueue(data);
            log.debug('Message Sent to Node Factory');
        } else {
            log.debug('Packet Dropped');
        }
    };
    
    triples.map(createNodeObjects);
    return data;
};

module.exports = highland.pipeline(
    highland.map(routeUserToFactory)
);