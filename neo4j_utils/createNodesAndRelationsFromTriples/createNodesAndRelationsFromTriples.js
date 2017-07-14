const _ = require('lodash');
const async = require('async');

const doesPropertyExists = require('../sro_utils/doesPropertyExists');
const createNode = require('../createNode');
const findOrCreateNode = require('../findOrCreateNode');
const createRelation = require('../createRelation');

const createNodesAndRelationsFromTriples = (data, cb) => {
    console.log(data.triples);
    const {triples} = data;
    const createPayload = (results, cb) => {
        const payload = {
            header: data.header,
            results: _.flattenDeep(results)
        };
        cb(null, payload);
    };
    const createNodesAndRelationship = (triple) => {
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
        

        return async.series.bind(null, [
            async.parallel.bind(null, operationsOnNodes),
            ...operationsOnRelations
        ]);
    };

    async.waterfall([
        async.series.bind(null, triples.map(createNodesAndRelationship)),
        createPayload    
    ], cb);

};

module.exports = createNodesAndRelationsFromTriples;