// # User Router

// ## user.router.js

// Imports the required dependencies.
// `doesPropertyExists` method determines if a property exists in an Object. Returns true if the property exists else returns false.
const _  = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const log = require('./sro_utils/logger')('User_Router');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

// `routeUserToFactory` routes the incoming user to the node factory.
// `createNodeObjects` inputs a triple.
// If the triple object has necessary properties for the node to be created. 
// Then it sends the node the node_factory.
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

// Exports the routing pipeline. It maps the input stream to `routeUserToFactory`
module.exports = highland.pipeline(
    highland.map(routeUserToFactory)
);