const fs = require('fs');
const path = require('path');

const getDirectories = (srcpath) => {
    return fs
            .readdirSync(srcpath)
            .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
};

module.exports = getDirectories;