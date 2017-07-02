const _ = require('lodash');
const async = require('async');
const createNode = require('../createNode');
const findOrCreateNode = require('../findOrCreateNode');
const createRelation = require('../createRelation');

const createNodesAndRelationsFromTriples = (triples, cb) => {
    const createNodesAndRelationship = (triple) => {
        if('undefined' === typeof triple.propertiesOfObject) {
            return findOrCreateNode.bind(null, triple.propertiesOfSubject);
        } else {
            const relation = {
                nameOfSourceNode: triple.propertiesOfSubject.name,
                labelOfSourceNode: triple.propertiesOfSubject.label,
                nameOfTargetNode: triple.propertiesOfObject.name,
                labelOfTargetNode: triple.propertiesOfObject.label
            };
            _.assign(relation, triple.propertiesOfPredicate);
            return async.series.bind(null, [
                async.parallel.bind(null,[
                    findOrCreateNode.bind(null, triple.propertiesOfSubject),
                    findOrCreateNode.bind(null, triple.propertiesOfObject)
                ]),
                createRelation.bind(null, relation)
            ]);
        }
    };
    async.series(triples.map(createNodesAndRelationship), cb);
};

module.exports = createNodesAndRelationsFromTriples;