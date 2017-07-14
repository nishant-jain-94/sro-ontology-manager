const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

const toTriplesOfMedia = (mediaContent) =>  {
    const percpMediaContent = mediaContent;
    
    const subject = {
        propertiesOfSubject: {
            label: 'content',            
            name: percpMediaContent.name.normalize(),
            identifier: percpMediaContent.identifier,
            contentType: percpMediaContent.contentType,
            contentSubType: percpMediaContent.contentSubType,
            url: percpMediaContent.url
        }
    };

    const triplesOfMedia = percpMediaContent.concepts.map((concept) => {
        const object = {
            propertiesOfObject: {
                label: 'concept',                
                name: concept.conceptTitle.normalize(),
                identifier: concept.conceptIdentifier           
            }
        };

        const predicate = {
            propertiesOfPredicate: {
                relation: 'explains'
            }
        };

        const triple = {};
    
        _.assign(triple, subject, predicate, object);
        return triple;
    });

    if(triplesOfMedia.length > 0) {
        return triplesOfMedia
    } else {
        return [subject]
    }
};

const processor = highland.pipeline(
    highland.map(toTriplesOfMedia),
    highland.flatMap(createNodesAndRelationsFromTriples),
)

module.exports = processor;