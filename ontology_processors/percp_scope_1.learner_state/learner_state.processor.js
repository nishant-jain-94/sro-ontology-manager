const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const toTriplesOfLearnerState = (message) =>  {
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
    
    const triplesOfLearnerState = percpLearnerState.elements.map((element) => {
        const target = {
            properties: {
                label: 'content',
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

    let triples;
    if(triplesOfLearnerState.length > 0) {
         triples = triplesOfLearnerState;
    } else {
        triples = [];
    };

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toTriplesOfLearnerState)
);

module.exports = processor;