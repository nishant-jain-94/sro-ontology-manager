const _ = require('lodash');
const queryExecutor = require('../queryExecutor');

const createUniqueConstraintOnNode = (label, callback) => {
	const query = `CREATE CONSTRAINT ON (${label}:${label}) ASSERT ${label}.name IS UNIQUE`;
	queryExecutor(query, callback);
};

module.exports = createUniqueConstraintOnNode;