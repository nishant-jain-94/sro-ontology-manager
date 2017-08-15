const _ = require('lodash');
const queryExecutor = require('../queryExecutor');
const log = require('../sro_utils/logger')('NEO4J_UTILS:CREATE_RELATION');


const createRelation = (properties, callback) => {
	const propertiesOfRelation = JSON
								.stringify(_.omit(properties, ['nameOfSourceNode', 'labelOfSourceNode', 'relation', 'nameOfTargetNode', 'labelOfTargetNode']))
								.replace(/\"(\w+)\":/g, "$1:");
								
	const query = `MATCH (m:${properties.labelOfSourceNode} {name: "${properties.nameOfSourceNode}"}), (n:${properties.labelOfTargetNode} {name: "${properties.nameOfTargetNode}"}) \
	CREATE UNIQUE (m)-[relation:${properties.relation} ${propertiesOfRelation}]->(n) \ 
	return relation`;
	return queryExecutor(query, callback);
};

module.exports = createRelation;