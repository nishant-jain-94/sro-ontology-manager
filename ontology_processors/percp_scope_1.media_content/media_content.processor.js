// # Media Content Processor

// ## mediaContent.processor.js

// Imports the required dependencies.
const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger')('Media_Content_Processor');
const normalize = require('./sro_utils/normalize');

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

    let triplesOfMediaContent = percpMediaContent.media.map((media) => {
        let source = {
            properties: {
                label: 'content',            
                name: percpMediaContent.media[0].title.normalize(),
                mediaContentId: percpMediaContent.identifier,
                contentType: percpMediaContent.contentType,
                contentSubType: percpMediaContent.contentSubType?percpMediaContent.contentSubType:'None',
                url: percpMediaContent.media[0].mediaUrl,
                mongoId: percpMediaContent._id
            },
            options: {
                uniqueConstraintsOn: [
                    'mediaContentId'
                ]
            }
        };
        let triplesOfConceptContent = percpMediaContent.concepts.map((concept) => {
            let target = {
                properties: {
                    label: 'concept',
                    name: concept.conceptTitle,
                    conceptIdentifier: concept.conceptIdentifier
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

        if(triplesOfConceptContent.length > 0) {
            return triplesOfConceptContent
        } else {
            return [{source}]
        }
    });

    let triples = _.flatten(triplesOfMediaContent);
    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfMedia.
const processor = highland.pipeline(
    highland.map(toTriplesOfMedia)
);

// Exports the processor
module.exports = processor;