const MongoClient = require('mongodb').MongoClient;
const {MONGODB_URL} = require('../config');
const dbs = {};

const getConnection = (db, cb) => {
    const mongodb_connection_url = `${MONGODB_URL}/${db}`;
    if(dbs[mongodb_connection_url]) {
        cb(null, dbs[mongodb_connection_url]);
    } else {
        MongoClient.connect(mongodb_connection_url, (err, db) => {
            if(!err) {
                dbs[mongodb_connection_url] = db;
                cb(null, dbs[mongodb_connection_url]);
                return;
            } else {
                cb(err, null);                
                return;
            }
        });
    }
};

module.exports = getConnection;