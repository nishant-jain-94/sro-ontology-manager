const {NEO4J_PROTOCOL, NEO4J_HOST, NEO4J_PORT, NEO4J_USERNAME, NEO4J_PASSWORD} = require('../config');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(`${NEO4J_PROTOCOL}://${NEO4J_HOST}`, neo4j.auth.basic(`${NEO4J_USERNAME}`, `${NEO4J_PASSWORD}`));
const session = driver.session();

const queryExecutor = (query, callback) => {
	return session
			.run(query)
			.then((result) => {return callback(null, result)})
			.catch((error) => {console.log(error); return callback(error, null);});
}

module.exports = queryExecutor;