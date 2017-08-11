const {NEO4J_PROTOCOL, NEO4J_HOST, NEO4J_PORT, NEO4J_USERNAME, NEO4J_PASSWORD} = require('../config');
const _ = require('lodash');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver(`${NEO4J_PROTOCOL}://${NEO4J_HOST}`, neo4j.auth.basic(`${NEO4J_USERNAME}`, `${NEO4J_PASSWORD}`));
const session = driver.session();
const {doesPropertyExists} = require('../sro_utils');
const log = require('../sro_utils/logger')('Bulk_Query_Executor');

const bulkQueryExecutor = (queries, callback) => {
    log.debug("Inside Bulk Query Executo")
    if(queries) {
        const writeTxs = session.writeTransaction(function(transaction) {
        const results = queries.map((query) => transaction.run(query));
        return Promise.all(results);
    }, {maxTransactionRetryTime: 60000});

	return  writeTxs
			.then((results) => { return callback(null, results); })
			.catch((error) => { log.error(error); return callback(error, null); });
    } else {
        callback(null, []);
    }   
}

module.exports = bulkQueryExecutor;