const queryExecutor = require('../queryExecutor');

const deleteAllNodes = (cb) => {
    const query = 'MATCH (n) DETACH DELETE n'
    queryExecutor(query, cb);
};

module.exports = deleteAllNodes;