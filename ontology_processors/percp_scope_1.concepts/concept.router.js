// # Concept Router

// ## concept.router.js

// Imports the required dependencies.
// `doesPropertyExists` method determines if a property exists in an Object. Returns true if the property exists else returns false.
const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

// `routeConceptsToFactory` routes the incoming concepts to the node_factory and relation_factory queues.
// It inputs a `data` which has `triples` as an array.
// It maps each `triple` in the `triples` to `createNodesAndRelationshipObjects` which tends to create a node and relations for every triple.

// `createNodesAndRelationshipObject` inputs a `triple`
// 1. Then checks if the `source` has necessary properties for the node to be created. 
// If so it is send to the node_factory with the source object.
// 2. Then checks if the `target` has necessary properties for the node to be created.
// If so it is send to the node_factory with the target object.
// 3. Then checks if the `relations` has necessary properties for the relationship to be created.
// If so it is send to the relation_factory with the object containing `source`. `target` and `relation`.
const routeConceptsToFactory = (data) => {
    const {triples} = data;

    const createNodesAndRelationshipObjects = (triple) => {

        if(doesPropertyExists(triple, 'source.properties.label') && doesPropertyExists(triple, 'source.properties.name')) {
            const data = {
                message: triple.source,
                queue: 'node_factory'
            };
            sendToQueue(data);
        }

        if(doesPropertyExists(triple, 'target.properties.label') && doesPropertyExists(triple, 'target.properties.name')) {
            const data = {
                message: triple.target,
                queue: 'node_factory'
            };
            sendToQueue(data);
        }
        
        if(doesPropertyExists(triple, 'relation.properties.relation')) {
            const data = {
                message: triple,
                queue: 'relation_factory'
            };
            console.log("Sending to relation factory");
            sendToQueue(data);
        }
    
    };

    triples.map(createNodesAndRelationshipObjects);

    return data;

};

// Exports the routing pipeline. It maps the input stream to `routeConceptsToFactory`
module.exports  = highland.pipeline(
    highland.map(routeConceptsToFactory)
);