const _ = require('lodash');
const async = require('async');
const createUniqueConstraintOnNode = require('../createUniqueConstraintOnNode')
const queryExecutor = require('../queryExecutor');

const createNode = (properties, callback) => {
	const {label} = properties;
	const propertiesOfNode = JSON.stringify(_.omit(properties, 'label'))
								 .replace(/\"(\w+)\":/g, "$1:");
	const query = `CREATE (n:${label} ${propertiesOfNode}) return n`;

	async.series([
			createUniqueConstraintOnNode.bind(null, label),
			queryExecutor.bind(null, query)
		],
		(error, results) => {
			if (!error)
				callback(error, results[1]);
			else
				callback(error, null);
		});
};

module.exports = createNode;