const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

const toTriplesOfConcepts = (message) =>  {
    const header = message;
    const oplog = JSON.parse(message.content.toString());
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

    let triples;
    if(triplesOfConcepts.length > 0) {
         triples = triplesOfConcepts
    } else {
        triples = [subject]
    };

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toTriplesOfConcepts),
    highland.flatMap(createNodesAndRelationsFromTriples),
    highland.collect()
);

module.exports = processor;