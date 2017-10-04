const { MongoClient } = require('mongodb');
const { MONGODB_URL } = require('../config');

const dbs = {};

const getConnection = (dbName, cb) => {
  const connectionUrl = `${MONGODB_URL}/${dbName}`;
  if (dbs[connectionUrl]) {
    cb(null, dbs[connectionUrl]);
  } else {
    MongoClient.connect(connectionUrl, (err, db) => {
      if (!err) {
        dbs[connectionUrl] = db;
        cb(null, dbs[connectionUrl]);
        return;
      }
      cb(err, null);
    });
  }
};

module.exports = getConnection;
