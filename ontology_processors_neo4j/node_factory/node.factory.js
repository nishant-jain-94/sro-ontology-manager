const async = require('async');
const highland = require('highland');
const mergeOrCreateNode = require('./neo4j_utils/mergeOrCreateNode');

const toObject = (message) => {
    const triple = JSON.parse(message.content.toString());
    const header = message;
    return {header, triple};
};

const mergeOrCreateNodeWrapper = highland.wrapCallback(({header, triple}, cb) => {
    mergeOrCreateNode(triple, (err, results) => {
        cb(err, {header, results});
    });
});

const node_factory = highland.pipeline(
    highland.map(toObject),
    highland.flatMap(mergeOrCreateNodeWrapper)
);

module.exports = node_factory;