const queryExecutor = require('../queryExecutor');

const getCountOfAllNodes = (cb) => {
    const query = 'MATCH (n) return count(n)';
    queryExecutor(query, cb);
};

module.exports = getCountOfAllNodes;