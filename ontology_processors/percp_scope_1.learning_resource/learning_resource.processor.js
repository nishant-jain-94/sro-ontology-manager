const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const toTriplesOfLearningResources = (message) => {
    const header = message;
    const percpLearningResource = JSON.parse(message.content.toString());
    const source = {
        properties: {
            label: 'content',
            resourceId: percpLearningResource.identifier,
            mediaContentId: percpLearningResource.contentIdentifier
        },
        options: {
            uniqueConstraintsOn: [
                'mediaContentId'
            ]
        }
    };

    let triples = [{source}];

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toTriplesOfLearningResources)
);

module.exports = processor;