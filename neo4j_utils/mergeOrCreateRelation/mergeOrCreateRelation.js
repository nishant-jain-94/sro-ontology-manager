const _ = require('lodash');
const async = require('async');
const queryExecutor = require('../queryExecutor');

const mergeOrCreateRelation = (properties, cb) => {
    const stringifyPropertiesOfRelationship = (properties, exclusionList=[]) => JSON.stringify(_.omit(properties, ...exclusionList)).replace(/\"(\w+)\":/g, "$1:");
    const setStringifyPropertiesOfRelationship = (stringPrefix, propertyPrefix, properties, exclusionList=[]) => {
        let stringifiedProperties = JSON.stringify(_.omit(properties, ...exclusionList))
                                .replace(/\"(\w+)\":/g, `${propertyPrefix}.$1=`).slice(1, -1);
        if (stringifiedProperties) {
           stringifiedProperties = stringPrefix + stringifiedProperties;
        }
        return stringifiedProperties;
    }
    
    const {source, target, relation} = properties;
    const labelOfSource = source.properties.label;
    const labelOfTarget = target.properties.label;
    const propertiesOfSource = _.pick(source.properties, ...source.options.uniqueConstraintsOn);
    const propertiesOfTarget = _.pick(target.properties, ...target.options.uniqueConstraintsOn);
    const propertiesOfRelationship = _.omit(relation.properties, 'relation');
    const relationship = relation.properties.relation;
    const exclusionList = ['label'];
    const query = `MATCH (source:${labelOfSource} ${stringifyPropertiesOfRelationship(propertiesOfSource, exclusionList)}), 
                   (target:${labelOfTarget} ${stringifyPropertiesOfRelationship(propertiesOfTarget, exclusionList)})
                   MERGE (source)-[relation:${relationship}]->(target)
                   ${setStringifyPropertiesOfRelationship('ON MATCH SET ', 'relation', propertiesOfRelationship)} 
                   ${setStringifyPropertiesOfRelationship('ON CREATE SET ', 'relation', propertiesOfRelationship)} 
                   RETURN source, target, relation`;
    queryExecutor(query, cb);
 };

module.exports = mergeOrCreateRelation;