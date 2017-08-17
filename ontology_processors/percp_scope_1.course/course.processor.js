// # Course Processor

// ## course.processor.js

//  Import required dependencies.
require('./sro_utils/normalize');
const highland = require('highland');
const log = require('./sro_utils/logger')('Concept_Processor');

// `toCourse` converts a course document to a course node.
// A triple is a combination of a source, target and relation. 
// `toTriplesOfConcepts` inputs a message(document) and then creates a collection of triple following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements.
// 2. Parses the string in the message to the concept.
// 3. Creates a `source` using the `label` and the `name`. With `name` being the property used to create concept Node.
// 4. Then using the `associations` of the concept we create `target` and `relation`.
// 5. And by this it generates a triple for each `association`.
// 6. And then returns an object containing `header` and `triples`
const toCourse = (message) =>  {
    const header = message;
    const percpCourse = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'course',            
            name: percpCourse.name.normalize(),
            displayName: percpCourse.name,
            description: percpCourse.homeDescription,
            courseId: percpCourse.identifier,
            mongoId: percpCourse._id
        },
        options: {
            uniqueConstraintsOn: [
                'courseId'
            ]
        }
    };
    
    log.debug("Inside Course Processor");
    let triples = [{source}];

    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfConcepts.
const processor = highland.pipeline(
    highland.map(toCourse)
);

// Exports the processor.
module.exports = processor;