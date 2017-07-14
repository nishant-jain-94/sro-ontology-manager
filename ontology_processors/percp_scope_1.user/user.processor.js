const _ = require('lodash');
const async = require('async');
const highland = require('highland');

const log = require('./sro_utils/logger');
const normalize = require('./sro_utils/normalize');

const createNodesAndRelationsFromTriples = highland.wrapCallback(require('./neo4j_utils/createNodesAndRelationsFromTriples'));

const toUserNodes = (message) => {
    const header = message;
    const percpUser = JSON.parse(message.content.toString());
    const subject = {
        propertiesOfSubject: {
            label: 'user',
            name: percpUser.displayName.normalize(),
            identifier: percpUser.identifier,
            uniqueId: percpUser.uniqueId
        }
    };
    const triples = [subject];

    return {header, triples};
};

const processor = highland.pipeline(
    highland.map(toUserNodes),
    highland.flatMap(createNodesAndRelationsFromTriples)
)

module.exports = processor;