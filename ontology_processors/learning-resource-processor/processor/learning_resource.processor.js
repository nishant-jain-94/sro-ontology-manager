// # Learning Resource Processor

// ## learning_resource.processor.js

// Imports the required dependencies.
const _ = require('lodash');
const highland = require('highland');

const log = require('../commons/logger')('Learning_Resource_Processor');

// `toLearningResource` converts a Learner State document to a source node.
// `toLearningResource` inputs a message and then creates a source node following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements.
// 2. Parses the string in the message to the learnerState.
// 3. Creates a `source` using the `label`, `resourceId` and `mediaContentId`.
// With `mediaContentId` being the property used to create user Node.
const toTriplesOfLearningResources = (message) => {
  log.debug('Converting Resource Oplog to triples of Learning Resource');
  const header = message;
  const percpLearningResource = JSON.parse(message.content.toString());
  const source = {
    properties: {
      label: 'resource',
      resourceId: percpLearningResource.identifier
    },
    options: {
      uniqueConstraintsOn: [
        'resourceId'
      ]
    }
  };

  const triplesOfLearningResourceAndConcepts = percpLearningResource.concepts.map((concept) => {
    const target = {
      properties: {
        label: 'concept',
        name: _.snakeCase(concept.conceptTitle)
      },
      options: {
        uniqueConstraintsOn: [
          'name'
        ]
      }
    };

    const relation = {
      properties: {
        relation: 'explains'
      }
    };
    return { source, target, relation };
  });

  const triplesOfLearningResourceAndContent = [{
    source,
    target: {
      properties: {
        label: 'content',
        mediaContentId: percpLearningResource.contentIdentifier
      },
      options: {
        uniqueConstraintsOn: [
          'mediaContentId'
        ]
      }
    },
    relation: {
      properties: {
        relation: 'aggregates'
      }
    }
  }];

  const triplesOfLearningResourceAndCourse = [{
    source,
    target: {
      properties: {
        label: 'course',
        courseId: percpLearningResource.courseId
      },
      options: {
        uniqueConstraintsOn: [
          'courseId'
        ]
      }
    },
    relation: {
      properties: {
        relation: 'usedIn'
      }
    }
  }];

  const triples = _.concat(
    triplesOfLearningResourceAndConcepts,
    triplesOfLearningResourceAndContent,
    triplesOfLearningResourceAndCourse
  );

  return { header, triples };
};

// The `processor` input a stream and maps it toLearningResource.
const processor = highland.pipeline(highland.map(toTriplesOfLearningResources));

// Exports the processor
module.exports = processor;
