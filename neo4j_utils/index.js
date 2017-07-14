const queryProcessors = {
    createNode: require('./createNode'),
    createNodesAndRelationsFromCsv: require('./createNodesAndRelationsFromCsv'),
    createNodesAndRelationsFromTriples: require('./createNodesAndRelationsFromTriples'),
    createRelation: require('./createRelation'),
    createUniqueConstraintOnNode: require('./createUniqueConstraintOnNode'),
    deleteAllNodes: require('./deleteAllNodes'),
    dropAllConstraints: require('./dropAllConstraints'),
    findNodes: require('./findNodes'),
    findOrCreateNode: require('./findOrCreateNode'),
    getConstraints: require('./getConstraints'),
    getCountOfAllNodes: require('./getCountOfAllNodes'),
    mergeOrCreateNode: require('./mergeOrCreateNode'),
    mergeOrCreateRelation: require('./mergeOrCreateRelation'),
    queryExecutor: require('./queryExecutor'),
    config: require('./config')
};

module.exports = queryProcessors;