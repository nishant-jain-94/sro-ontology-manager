const request = require('request');
const {NEO4J_HOST, NEO4J_PORT, NEO4J_BASE64_ENCODED_CREDENTIALS} = require('../config');

const options = {
		url: `http://${NEO4J_HOST}:${NEO4J_PORT}/db/data/schema/constraint`,
		headers: {
			'Authorization': `BASIC ${NEO4J_BASE64_ENCODED_CREDENTIALS}`
		}
	};

const getConstraints = (callback) => {
		request(options, (error, response) => {
			callback(error, JSON.parse(response.body));
		});	
	};

module.exports = getConstraints;