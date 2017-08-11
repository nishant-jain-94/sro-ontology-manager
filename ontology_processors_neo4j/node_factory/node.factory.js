// # Node Factory

// ## node.factory.js

// The Stage where the Nodes gets created.

// Imports the following dependencies.
// `mergeOrCreateNode` Merges the properties of the old node with the properties of the new node. If the old node doesn't exist it creates a new Node.
const async = require('async');
const highland = require('highland');
const _ = require('lodash');
const {doesPropertyExists} = require('./sro_utils');
const queryExecutorWithParams = require('./neo4j_utils/queryExecutorWithParams');
// const bulkMergeOrCreateNode = require('./neo4j_utils/bulkMergeOrCreateNode');
const log = require('./sro_utils/logger')('Node_Factory_Processor');

// `toObject` creates a new packet containing `header` and the `triple`
// 1. `header` - refers to the both data and the metadata of the Message fetched from the Queue.
// 2. `triple` - refers to the triple to be used for Node Creation.
const toObject = (messages) => {
    log.debug({count: messages.length});
    const bulkMessages = messages.map((message) => {
        const triple = JSON.parse(message.content.toString());
        const header = message;
        return {header, triple};
    });
    return bulkMessages;
};

const bulkMergeOrCreateNode = (nodesToBeCreated, cb) => {
    // let queries = [];
    let batch = [];
    nodesToBeCreated.forEach(({properties, options}) => {
        const stringifyNodeProperties = (properties, exclusionList=[]) => JSON.stringify(_.omit(properties, ...exclusionList))
								 .replace(/\"(\w+)\":/g, "$1:");
        const setStringifyNodeProperties = (stringPrefix, propertyPrefix, properties, exclusionList=[]) => {
            let stringifiedProperties = JSON.stringify(_.omit(properties, ...exclusionList))
                                    .replace(/\"(\w+)\":/g, `${propertyPrefix}.$1=`).slice(1, -1);
            if(stringifiedProperties) {
                stringifiedProperties = stringPrefix + stringifiedProperties;
            };

            return stringifiedProperties;
        };

        let uniqueConstraintsOn = [];
        options = options?options:{};
        if(doesPropertyExists(options, 'uniqueConstraintsOn')) {
            uniqueConstraintsOn = options.uniqueConstraintsOn;
        }
        const uniqueProperties = _.pick(properties, ...uniqueConstraintsOn);
        const nodeProperties = _.omit(properties, 'label', ...uniqueConstraintsOn);
        const {label} = properties;
        const labels = label;
        const uniqueValue = uniqueProperties[uniqueConstraintsOn[0]];
        batch.push({label, uniqueValue, nodeProperties});
    });
    
    log.debug({batch: batch});
    
    const query = `UNWIND {batch} as row
    FOREACH (_ IN CASE when row.label='user' then [1] else [] end |
    MERGE (n:user {uniqueId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='concept' then [1] else [] end |
    MERGE (n:concept {name: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='course' then [1] else [] end |
    MERGE (n:course {courseId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='content' then [1] else [] end |
    MERGE (n:content {mediaContentId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)
    FOREACH (_ IN CASE when row.label='resource' then [1] else [] end |
    MERGE (n:resource {resourceId: row.uniqueValue}) ON CREATE SET n+=row.nodeProperties ON MATCH SET n+=row.nodeProperties)`;
    
    queryExecutorWithParams(query, {batch: batch}, cb);
};

// `mergeOrCreateNodeWrapper` is a wrapper around mergeOrCreateNode which makes it easier to use with highland pipeline.
const mergeOrCreateNodeWrapper = highland.wrapCallback((bulkMessages, cb) => {
    const triples = bulkMessages.map((message) => message.triple);
    const headers = bulkMessages.map((message) => message.header);
    bulkMergeOrCreateNode(triples, (err, results) => {
        if(err) { log.error(err); process.exit(0); }
        else return cb(null, {headers, results});
    });
    // const results = [];
    // cb(null, {headers, results});
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