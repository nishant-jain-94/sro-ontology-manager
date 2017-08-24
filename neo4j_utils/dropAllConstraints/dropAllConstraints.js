const request = require('request');
const async = require('async');

const queryExecutor = require('../queryExecutor');
const getConstraints = require('../getConstraints');

const dropAllConstraints = (callback) => {

	function dropConstraints(constraints, callback) {
		const queryExecutorToDropConstraints = async.map(constraints, ({property_keys, label, type}, callback) => {
			const query = `DROP CONSTRAINT ON (label:${label}) ASSERT label.${property_keys[0]} IS UNIQUE`;
			return queryExecutor.bind(null, query, callback);
		});
		async.series(queryExecutorToDropConstraints, callback);
	};

	async.waterfall([
		getConstraints,
		dropConstraints
		], callback);
	
};

module.exports = dropAllConstraints;