// # User Processor

// ## user.processor.js

// Imports the required dependencies.
require('./sro_utils/normalize');
const highland = require('highland');

// const log = require('./sro_utils/logger')('User_Processor');

// `toUserNodes` converts a User Document to a user node. 
const toUserNodes = (message) => {
    const header = message;
    const percpUser = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: `user`,
            userType: percpUser.userType,
            displayName: percpUser.displayName.normalize(),
            identifier: percpUser.identifier,
            uniqueId: percpUser.uniqueId,
            mongoId: percpUser._id
        },
        options: {
            uniqueConstraintsOn: [
                'uniqueId'
            ]
        }
    };
    const triples = [{source}];

    return {header, triples};
};

// The `processor` input a stream and maps it toTriplesOfMedia.
const processor = highland.pipeline(
    highland.map(toUserNodes)
);

// Exports the processor
module.exports = processor;