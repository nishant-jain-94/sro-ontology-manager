// # Media Content Processor

// ## mediaContent.processor.js

// Imports the required dependencies.
const _ = require('lodash');
const highland = require('highland');
const log = require('../commons/logger')('MEDIA_CONTENT_PROCESSOR');

// `toTriplesOfMedia` converts a Media Content Document to a Triple.
// `toTriplesOfMedia` inputs a message and then creates a source node following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements
// 2. Parses the string in the message to the mediaContent.
// 3. Creates a source node using the `label`, `name` and other properties.
// 4. The source node is created with uniqueConstraintsOn `mediaContentId`
// meaning that when the node is created `mediaContentId` is
// used as the pattern to create node.
// 5. Then using the concepts in the mediaContentNode,
// triples of Concept and Content node is created.
const toTriplesOfMedia = (message) => {
  const header = message;
  const percpMediaContent = JSON.parse(message.content.toString());

  const source = {
    properties: {
      label: 'content',
      mediaContentId: percpMediaContent.identifier,
      contentType: percpMediaContent.contentType,
      contentSubType: percpMediaContent.contentSubType ? percpMediaContent.contentSubType : 'None',
      mongoId: percpMediaContent._id
    },
    options: {
      uniqueConstraintsOn: [
        'mediaContentId'
      ]
    }
  };

  source.properties.displayName = percpMediaContent.media[0] ? percpMediaContent.media[0].title : '';
  source.properties.url = percpMediaContent.media[0] ? percpMediaContent.media[0].url : '';

  const triplesOfConceptContent = percpMediaContent.concepts.map((concept) => {
    const target = {
      properties: {
        label: 'concept',
        name: concept.conceptTitle ? _.snakeCase(concept.conceptTitle) : '',
        conceptId: concept.conceptIdentifier
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
      },
      options: {
        uniqueConstraintsOn: [
          'relation'
        ]
      }
    };

    return { source, target, relation };
  });


  const linkedCourses = percpMediaContent.linkedCourses.filter(course => course !== '');
  const triplesOfCourseContent = linkedCourses.map((course) => {
    const target = {
      properties: {
        label: 'course',
        courseId: course
      },
      options: {
        uniqueConstraintsOn: [
          'courseId'
        ]
      }
    };

    const relation = {
      properties: {
        relation: 'usedIn'
      },
      options: {
        uniqueConstraintsOn: [
          'relation'
        ]
      }
    };

    return { source, target, relation };
  });


  let triples = _.concat(triplesOfConceptContent, triplesOfCourseContent);

  if (!triples.length) {
    triples.push({ source });
  }

  triples = _.flatten(triples);
  log.debug(triples);
  return { header, triples };
};

// The `processor` input a stream and maps it toTriplesOfMedia.
const processor = highland.pipeline(highland.map(toTriplesOfMedia));

// Exports the processor
module.exports = processor;
