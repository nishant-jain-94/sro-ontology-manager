const log = require('../../util/logger');
// const createNode = highland.wrapCallback(require('../../query_processors/createNode'));

const processor = (s) => {
    log.debug(s);
};

module.exports = processor;