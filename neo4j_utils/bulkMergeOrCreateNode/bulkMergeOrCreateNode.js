const _ = require('lodash');
const async = require('async');
const createUniqueConstraintOnNode = require('../createUniqueConstraintOnNode');
const bulkQueryExecutor = require('../bulkQueryExecutor');
const queryExecutorWithParams = require('../queryExecutorWithParams');
const {doesPropertyExists} = require('../sro_utils');
const log = require('../sro_utils/logger')('BULK_MERGE_OR_CREATE_NODE');

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

const bulkMergeOrCreateNode = (nodesToBeCreated, cb) => {
    let queries = [];
    nodesToBeCreated.forEach(({properties, options}) => {
        let uniqueConstraintsOn = [];
        options = options?options:{};
        if(doesPropertyExists(options, 'uniqueConstraintsOn')) {
            uniqueConstraintsOn = options.uniqueConstraintsOn;
        }
        const uniqueProperties = _.pick(properties, ...uniqueConstraintsOn);
        const nodeProperties = _.omit(properties, 'label', ...uniqueConstraintsOn);
        const {label} = properties;
        const labels = [label];
        const query = `MERGE (n:${label} ${stringifyNodeProperties(_.assign({}, uniqueProperties))}) 
        ${setStringifyNodeProperties('ON MATCH SET ', 'n', nodeProperties)} 
        ${setStringifyNodeProperties('ON CREATE SET ', 'n', nodeProperties)} RETURN n`;
        queries.push(query);
    });
    bulkQueryExecutor(queries, cb);
};

module.exports = bulkMergeOrCreateNode;