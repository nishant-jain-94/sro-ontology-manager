const csv = require('fast-csv');
const path = require('path');
const _ = require('lodash');
const highland = require('highland');

const createNode = highland.wrapCallback(require('../createNode'));
const createRelations = highland.wrapCallback(require('../createRelation'));

const createFromCsv = (pathOfCsvFile, intent, cb) => {	
	
	const csvStream = csv.fromPath(path.join(__dirname, pathOfCsvFile), { headers: true, headers: true })
	
	highland(csvStream)
	.flatMap(intent)
	.collect()
	.toCallback(cb);
	
}; 

exports.createNodesFromCsv = (pathOfCsvFile, cb) => createFromCsv(pathOfCsvFile, createNode, cb);

exports.createRelationsFromCsv = (pathOfCsvFile, cb) => createFromCsv(pathOfCsvFile, createRelations, cb);
