// # Node Factory

// ## node.factory.js

// The Stage where the Nodes gets created.

// Imports the following dependencies.
// `mergeOrCreateNode` Merges the properties of the old node with the properties of the new node. If the old node doesn't exist it creates a new Node.
const async = require('async');
const highland = require('highland');
const mergeOrCreateNode = require('./neo4j_utils/mergeOrCreateNode');

// `toObject` creates a new packet containing `header` and the `triple`
// 1. `header` - refers to the both data and the metadata of the Message fetched from the Queue.
// 2. `triple` - refers to the triple to be used for Node Creation.
const toObject = (message) => {
    const triple = JSON.parse(message.content.toString());
    const header = message;
    return {header, triple};
};

// `mergeOrCreateNodeWrapper` is a wrapper around mergeOrCreateNode which makes it easier to use with highland pipeline.
const mergeOrCreateNodeWrapper = highland.wrapCallback(({header, triple}, cb) => {
    mergeOrCreateNode(triple, (err, results) => {
        if(err) process.exit(0);
        else cb(null, {header, results});
    });
});

// `node_factory` is a stream with following stages
// 1. Converts the incoming message to the object using `toObject`
// 2. Maps the message to the `mergeOrCreateNodeWrapper` which either merges or creates a node based on it's availability. 
const node_factory = highland.pipeline(
    highland.map(toObject),
    highland.flatMap(mergeOrCreateNodeWrapper)
);

// Exports the `node_factory`
module.exports = node_factory;