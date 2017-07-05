const _ = require('lodash');

const doesObjectPropertyExists = (object, path) => {
    const values = [undefined, null, '']
    if (values.indexOf(_.get(object, path)) > -1 ) return false;
    return true
};

module.exports = doesObjectPropertyExists;