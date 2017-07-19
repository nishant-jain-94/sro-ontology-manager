const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

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

const processor = highland.pipeline(
    highland.map(toUserNodes)
);

module.exports = processor;