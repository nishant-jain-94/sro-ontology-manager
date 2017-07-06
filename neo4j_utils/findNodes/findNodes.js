const _ = require('lodash');
const queryExecutor = require('../queryExecutor');

const findNodes = (properties, callback) => {
	var {label} = properties;
	const propertiesOfNode = JSON.stringify(_.pick(properties, 'name')).replace(/\"(\w+)\":/g, "$1:");
	label = label?':'.concat(label):'';
	const query = `MATCH (n${label} ${propertiesOfNode}) return n`;
	queryExecutor(query, callback); 
};

module.exports = findNodes;