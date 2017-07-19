const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

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

const processor = highland.pipeline(
    highland.map(toTriplesOfMedia)
);

module.exports = processor;