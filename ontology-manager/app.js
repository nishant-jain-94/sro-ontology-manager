const mongoose = require('mongoose');
const highland = require('highland');

const log = require('./util/logger');
const pipeline = require('./pipeline');
const db = mongoose.connect('mongodb://localhost/local');

mongoose.connection.on('open', () => {
    const collection = mongoose.connection.db.collection('oplog.rs');
    const stream = collection.find({}, {
        tailable: true,
        awaitdata: true,
        numberOfRetries: 10
    }).stream();

    highland('data', stream).through(pipeline);
});