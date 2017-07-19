const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const log = require('./sro_utils/logger');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

const routeLearningResourceToFactory = (data) => {
  const {triples} = data;  

  const createNodesAndRelationshipObjects = (triple) => {
    if(doesPropertyExists(triple, 'source.properties.mediaContentId')) {
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

module.exports = highland.pipeline(
    highland.map(routeLearningResourceToFactory)
);