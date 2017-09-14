// # User Processor

// ## user.processor.js

// Imports the required dependencies.
const _ = require('lodash');
const highland = require('highland');
const log = require('../commons/logger')('User_Processor');

// `toUserNodes` converts a User Document to a user node.
const toUserNodes = (message) => {
  log.debug('Converting User Oplogs to User Nodes');
  const header = message;
  const percpUser = JSON.parse(message.content.toString());
  const source = {
    properties: {
      label: 'user',
      userType: percpUser.userType,
      displayName: _.snakeCase(percpUser.displayName),
      identifier: percpUser.identifier,
      uniqueId: percpUser.uniqueId,
      mongoId: percpUser._id
    },
    options: {
      uniqueConstraintsOn: [
        'uniqueId'
      ]
    }
  };
  const triples = [{ source }];

  return { header, triples };
};

// The `processor` input a stream and maps it toTriplesOfMedia.
const processor = highland.pipeline(highland.map(toUserNodes));

// Exports the processor
module.exports = processor;
