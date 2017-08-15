const _ = require('lodash');
const async = require('async');

const doesPropertyExists = require('../sro_utils/doesPropertyExists');
const createNode = require('../createNode');
const findOrCreateNode = require('../findOrCreateNode');
const createRelation = require('../createRelation');

const createNodesAndRelationsFromTriple = (triple, cb) => {

    let operationsOnNodes = [];
    let operationsOnRelations = [];

    const bindToFindOrCreateNode = (node) => findOrCreateNode.bind(null, node);
    const bindToCreateRelation = (relation) => createRelation.bind(null, relation);

    if(doesPropertyExists(triple, 'propertiesOfSubject.label')) {
        operationsOnNodes.push(bindToFindOrCreateNode(triple.propertiesOfSubject)); 
    }
    
    if(doesPropertyExists(triple, 'propertiesOfObject.label')) {
        operationsOnNodes.push(bindToFindOrCreateNode(triple.propertiesOfObject));
    }
    
    if(doesPropertyExists(triple, 'propertiesOfPredicate.relation')) {
        const relation = {
            nameOfSourceNode: triple.propertiesOfSubject.name,
            labelOfSourceNode: triple.propertiesOfSubject.label,
            nameOfTargetNode: triple.propertiesOfObject.name,
            labelOfTargetNode: triple.propertiesOfObject.label
        };
        _.assign(relation, triple.propertiesOfPredicate);
        operationsOnRelations.push(bindToCreateRelation(relation));
    }
    

    return async.series([
        async.parallel.bind(null, operationsOnNodes),
        ...operationsOnRelations
    ], (err, results) => {
        if(!err) cb(null, _.flattenDeep(results));
        else cb(err, null);
    });

};

module.exports = createNodesAndRelationsFromTriple;