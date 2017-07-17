const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

const routeLearningResourceToFactory = (data) => {
  const {triples} = data;  

  const createNodesAndRelationshipObjects = (triple) => {
    if(doesPropertyExists(triple, 'node.properties.identifier')) {
        const data = {
            message: triple.source,
            queue: 'node_factory'
        };
        console.log("Sending to node factory");
        sendToQueue(data);
    }
  };

  triples.map(createNodesAndRelationshipObjects);

  return data;

};

module.exports = highland.pipeline(
    highland.map(routeLearningResourceToFactory)
);