const highland = require('highland');
const handlers = [
    require('./insertHandler'),
    require('./updateHandler')
    ];

const oplogHandler = (s) => {
    const streams = handlers.map((handler) => s.fork().pipe(handler));

    return highland(streams).merge();
};

module.exports = oplogHandler;
