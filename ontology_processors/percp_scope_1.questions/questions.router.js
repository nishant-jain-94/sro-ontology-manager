// # Question Router

// ## question.router.js

// Imports the required dependencies.
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const log = require('./sro_utils/logger')('Question_Router');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

// `routeQuestionsToFactory` routes a question to a Node Factory.
// Checks for the properties.identifier as a necessary property to create node.
// If the property exists it sends the node to the Node Factory.
const routeQuestionsToFactory = (data) => {
    const {triples} = data;
    const createNodesAndRelationshipObjects = (triple) => {
        if(doesPropertyExists(triple, 'source.properties.identifier')) {
            const data = {
                message: triple.source,
                queue: 'node_factory'
            };
            log.debug("Sending to node factory");
            sendToQueue(data);
        }
        else {
            log.debug("Not sending to Node Factory");        
        }
    };
    
    triples.map(createNodesAndRelationshipObjects);

    return data;

};

// Exports the routing pipeline. It maps the input stream to `routeQuestionsToFactory`
module.exports = highland.pipeline(
    highland.map(routeQuestionsToFactory)
);