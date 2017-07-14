const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

const toTriplesOfMedia = (message) =>  {
    const header = message;
    const percpMedia = JSON.parse(message.content.toString());
    const subject = {
        propertiesOfSubject: {
            label: 'content',            
            name: percpMedia.title? percpMedia.title.normalize(): percpMedia.title,
            identifier: percpMedia.identifier,
            url: percpMedia.url,
            description: percpMedia.description,
            is_deleted: percpMedia.is_deleted            
        }
    };
   
    return {header, triples: [subject]}
};

const processor = highland.pipeline(
    highland.map(toTriplesOfMedia),
    highland.flatMap(createNodesAndRelationsFromTriples)
)

module.exports = processor;