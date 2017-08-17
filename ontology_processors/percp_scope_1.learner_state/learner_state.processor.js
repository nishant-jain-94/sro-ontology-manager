// # Learner State Processor

// ## learner_state.processor.js

// Imports the required dependencies.
require('./sro_utils/normalize');
const _ = require('lodash');
const highland = require('highland');

const log = require('./sro_utils/logger')('Learning_Resource_Processor');

// `toTriplesOfLearnerState` converts a Learner State document to a collection of triples.
// A triple is a combination of a source, target and relation.
// `toTriplesOfLearnerState` inputs a message and then creates a collection of triples following the steps below.
// 1. Stores the `message` in `header` which is to be used in later stages to send Acknowledgements.
// 2. Parses the string in the message to the learnerState.
// 3. Creates a `source` using the `label` and the `identifier`. With `identifier` being the property used to create user Node.
// 4. Then using the `elements` of the learnState we create `target` and `relation`.
// 5. Then based on the state of the element 0, 1 or 2. It is mapped to a relation like `yetToStart`, `started`, `completed`.
// 6. And by this it generates a triple for each `element`.
// 7. And then returns an object containing `header` and `triples`.
const toTriplesOfLearnerState = (message) =>  {
    log.debug("To Triples Of Learner State");
    const header = message;
    const percpLearnerState = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'user',            
            identifier: percpLearnerState.student_id
        },
        options: {
            uniqueConstraintsOn: [
                'identifier'
            ]
        }
    };
    
    const learningResources = percpLearnerState.elements.filter((element) => element.elementType === 'learningresource');
    const triplesOfLearnerStateAndLearningResource = learningResources.map((element) => {
        const target = {
            properties: {
                label: 'resource',
                resourceId: element.identifier
            },
            options: {
                uniqueConstraintsOn: [
                    'resourceId'
                ]
            }
        };

        let relationType = 'yetToStart';

        if (undefined !== typeof element.state) {
            if(element.state === 1) relationType = 'started';
            if(element.state === 2) relationType = 'completed';
        }

        const relation = {
            properties: {
                relation: relationType
            },
            options: {
                uniqueConstraintsOn: [
                    'relation'
                ]
            }
        };

        return {source, target, relation};
    });

    const triplesOfLearnerStateAndCourse = [{
        source,
        target: {
            properties: {
                label: 'course',
                courseId: percpLearnerState.courseId
            },
            options: {
                uniqueConstraintsOn: [
                    'courseId'
                ]
            }
        },
        relation: {
            properties: {
                relation: 'subscribedTo'
            }
        }
    }];

    let triples = _.concat(triplesOfLearnerStateAndLearningResource, triplesOfLearnerStateAndCourse);

    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfLearnerState.
const processor = highland.pipeline(
    highland.map(toTriplesOfLearnerState)
);

// Exports the processor.
module.exports = processor;