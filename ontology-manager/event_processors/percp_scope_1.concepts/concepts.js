const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('../../util/logger');
const replaceWhiteSpaceByUnderscore = require('../../util/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('../../query_processors/createNodesAndRelationsFromTriples'));

const toTriplesOfConcepts = (oplog) =>  {
    const percpConcept = oplog.o; 
    const subject = {
        propertiesOfSubject: {
            label: 'concept',            
            name: percpConcept.title.normalize(),
            identifier: percpConcept.identifier            
        }
    };
    
    const triplesOfConcepts = percpConcept.associations.map((association) => {
        const object = {
            propertiesOfObject: {
                label: 'concept',                
                name: association.conceptTitle.normalize(),
                identifier: association.conceptId            
            }
        };

        const predicate = {
            propertiesOfPredicate: {
                relation: association.tag.normalize()
            }
        };

        const triple = {};
    
        _.assign(triple, subject, predicate, object);
        return triple;
    });

    if(triplesOfConcepts.length > 0) {
        return triplesOfConcepts
    } else {
        return [subject]
    }
};

const processor = highland.pipeline(
    highland.map(toTriplesOfConcepts),
    highland.flatMap(createNodesAndRelationsFromTriples),
    highland.collect()
)

module.exports = processor;