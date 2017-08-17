// # Media Content Processor

// ## mediaContent.processor.js

// Imports the required dependencies.
require('./sro_utils/normalize');
const _ = require('lodash');
const highland = require('highland');

const log = require('./sro_utils/logger')('Media_Content_Processor');

// `toTriplesOfMedia` converts a Media Content Document to a Triple.
// `toTriplesOfMedia` inputs a message and then creates a source node following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements
// 2. Parses the string in the message to the mediaContent.
// 3. Creates a source node using the `label`, `name` and other properties.
// 4. The source node is created with uniqueConstraintsOn `mediaContentId` meaning that when the node is created `mediaContentId` is used as the pattern to create node.
// 5. Then using the concepts in the mediaContentNode, triples of Concept and Content node is created.
const toTriplesOfMedia = (message) =>  {
    const header = message;
    const percpMediaContent = JSON.parse(message.content.toString());

    let source = {
        properties: {
            label: 'content',
            mediaContentId: percpMediaContent.identifier,
            contentType: percpMediaContent.contentType,
            contentSubType: percpMediaContent.contentSubType?percpMediaContent.contentSubType:'None',
            mongoId: percpMediaContent._id
        },
        options: {
            uniqueConstraintsOn: [
                'mediaContentId'
            ]
        }
    };

    percpMediaContent.media.map((media) => {
        source.properties.displayName = media.title;
        source.properties.url = media.url;
    });
        
    let triplesOfConceptContent = percpMediaContent.concepts.map((concept) => {
        let target = {
            properties: {
                label: 'concept',
                name: concept.conceptTitle ? concept.conceptTitle.normalize() : "",
                conceptId: concept.conceptIdentifier
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
        };

        let relation = {
            properties: {
                relation: 'explains'
            },
            options: {
                uniqueConstraintsOn: [
                    'relation'
                ]
            }
        };

        return {source, target, relation}
    });


    let linkedCourses = percpMediaContent.linkedCourses.filter((course) => course !== "");
    let triplesOfCourseContent = linkedCourses.map((course) => {
        let target = {
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

        let relation = {
            properties: {
                relation: 'usedIn'
            },
            options: {
                uniqueConstraintsOn: [
                    'relation'
                ]
            }
        };
        
        return {source, target, relation};
    });


    let triples = _.concat(triplesOfConceptContent, triplesOfCourseContent);

    if(!triples.length) {
        triples.push({source})
    }

    triples = _.flatten(triples);
    log.debug(triples);
    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfMedia.
const processor = highland.pipeline(
    highland.map(toTriplesOfMedia)
);

// Exports the processor
module.exports = processor;