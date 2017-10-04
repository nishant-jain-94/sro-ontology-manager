const requireDoesPropertyExists = require('./doesPropertyExists');
const requireGetDirectories = require('./getDirectories');
const requireLogger = require('./logger');
const requireNormalize = require('./normalize');

const sroUtils = {
  doesPropertyExists: requireDoesPropertyExists,
  getDirectories: requireGetDirectories,
  logger: requireLogger,
  normalize: requireNormalize,
};

module.exports = sroUtils;
