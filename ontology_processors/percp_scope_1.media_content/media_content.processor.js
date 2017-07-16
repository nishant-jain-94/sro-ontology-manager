const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

const toTriplesOfMedia = (message) =>  {
    const header = message;
    const percpMediaContent = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'content',            
            name: percpMediaContent.name.normalize(),
            identifier: percpMediaContent.identifier,
            contentType: percpMediaContent.contentType,
            contentSubType: percpMediaContent.contentSubType,
            url: percpMediaContent.media[0].mediaUrl
        },
        options: {
            uniqueConstraintsOn: [
                'url'
            ]
        }
    };

    const triplesOfMedia = percpMediaContent.concepts.map((concept) => {
        const target = {
            properties: {
                label: 'concept',                
                name: concept.conceptTitle.normalize(),
                identifier: concept.conceptIdentifier           
            },
            options: {
                uniqueConstraintsOn: [
                    'url'
                ]
            }
        };

        const relation = {
            properties: {
                relation: 'explains'
            }
        };

        return {source, target, relation};

    });

    let triples;
    if(triplesOfMedia.length > 0) {
        triples = triplesOfMedia
    } else {
        triples = [source]
    };

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toTriplesOfMedia),
    highland.flatMap(createNodesAndRelationsFromTriples)
);

module.exports = processor;