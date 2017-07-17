const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const {sendToQueue} = require('./amqp_utils');
const doesPropertyExists = require('./sro_utils/doesPropertyExists');

const routeLearnerStateToFactory = (data) => {
  const {triples} = data;  

  const createNodesAndRelationshipObjects = (triple) => {
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

module.exports = highland.pipeline(
    highland.map(routeLearnerStateToFactory)
);