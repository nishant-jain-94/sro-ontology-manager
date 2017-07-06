const _ = require('lodash');
const queryExecutor = require('../queryExecutor');
const log = require('../sro_utils/logger');


const createRelation = (properties, callback) => {
	const propertiesOfRelation = JSON
								.stringify(_.omit(properties, ['nameOfSourceNode', 'labelOfSourceNode', 'relation', 'nameOfTargetNode', 'labelOfTargetNode']))
								.replace(/\"(\w+)\":/g, "$1:");
								
	const query = `MATCH (${properties.nameOfSourceNode}:${properties.labelOfSourceNode} {name: "${properties.nameOfSourceNode}"}), (${properties.nameOfTargetNode}:${properties.labelOfTargetNode} {name: "${properties.nameOfTargetNode}"}) \
	CREATE UNIQUE (${properties.nameOfSourceNode})-[relation:${properties.relation} ${propertiesOfRelation}]->(${properties.nameOfTargetNode}) \ 
	return relation`;
	return queryExecutor(query, callback);
};

module.exports = createRelation;