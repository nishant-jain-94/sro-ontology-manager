const async = require('async');
const findNodes = require('../findNodes');
const createNode = require('../createNode');

const createNodeIfNotFound = (properties, result, cb) => {
    if (result.records.length)
        return cb(null, result);
    else
        return createNode(properties, cb);
};

const findOrCreateNode = (properties, cb) => {
    async.waterfall([
        findNodes.bind(null, properties),
        createNodeIfNotFound.bind(null, properties)
    ], cb)
};

module.exports = findOrCreateNode;