// # Concept Processor

// ## concept.processor.js

//  Import required dependencies.
require('./sro_utils/normalize');
const highland = require('highland');

// const log = require('./sro_utils/logger')('Concept_Processor');

// `toTriplesOfConcepts` converts a concept document to a collection of triples.
// A triple is a combination of a source, target and relation. 
// `toTriplesOfConcepts` inputs a message(document) and then creates a collection of triple following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements.
// 2. Parses the string in the message to the concept.
// 3. Creates a `source` using the `label` and the `name`. With `name` being the property used to create concept Node.
// 4. Then using the `associations` of the concept we create `target` and `relation`.
// 5. And by this it generates a triple for each `association`.
// 6. And then returns an object containing `header` and `triples`
const toTriplesOfConcepts = (message) =>  {
    const header = message;
    const percpConcept = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'concept',            
            name: percpConcept.title.normalize(),
            displayName: percpConcept.title,
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
                displayName: association.conceptTitle,
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

        return {source, target, relation};
    });

    let triples;
    if(triplesOfConcepts.length > 0) {
         triples = triplesOfConcepts
    } else {
        triples = [source]
    }

    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfConcepts.
const processor = highland.pipeline(
    highland.map(toTriplesOfConcepts)
);

// Exports the processor.
module.exports = processor;