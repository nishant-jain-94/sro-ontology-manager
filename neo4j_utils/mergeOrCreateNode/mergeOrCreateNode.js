const _ = require('lodash');
const async = require('async');
const createUniqueConstraintOnNode = require('../createUniqueConstraintOnNode');
const queryExecutor = require('../queryExecutor');
const {doesPropertyExists} = require('../sro_utils')

const mergeOrCreateNode = ({properties, options}, cb) => {
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
    const query = `MERGE (n:${label} ${stringifyNodeProperties(_.assign({}, uniqueProperties))}) 
    ${setStringifyNodeProperties('ON MATCH SET ', 'n', nodeProperties)} 
    ${setStringifyNodeProperties('ON CREATE SET ', 'n', nodeProperties)} RETURN n`;

    queryExecutor(query, cb);
};

module.exports = mergeOrCreateNode;