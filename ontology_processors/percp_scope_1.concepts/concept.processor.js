const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const toTriplesOfConcepts = (message) =>  {
    const header = message;
    const percpConcept = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'concept',            
            name: percpConcept.title.normalize(),
            identifier: percpConcept.identifier            
        },
        options: {
            uniqueConstraintsOn: [
                'name'
            ]
        }
    };
    
    const triplesOfConcepts = percpConcept.associations.map((association) => {
        const target = {
            properties: {
                label: 'concept',                
                name: association.conceptTitle.normalize(),
                identifier: association.conceptId            
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                    ]
            }
        };

        const relation = {
            properties: {
                relation: association.tag.normalize()
            }
        };

        const triple = {};
    
        return {source, target, relation};
    });

    let triples;
    if(triplesOfConcepts.length > 0) {
         triples = triplesOfConcepts
    } else {
        triples = [source]
    };

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toTriplesOfConcepts)
);

module.exports = processor;