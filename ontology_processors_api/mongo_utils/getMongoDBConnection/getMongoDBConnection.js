const { MongoClient } = require('mongodb');
const { MONGODB_URL } = require('../config');

const dbs = {};

const getConnection = (dbName, cb) => {
  const mongodbConnectionUrl = `${MONGODB_URL}/${dbName}`;
  if (dbs[mongodbConnectionUrl]) {
    cb(null, dbs[mongodbConnectionUrl]);
  } else {
    MongoClient.connect(mongodbConnectionUrl, (err, db) => {
      if (!err) {
        dbs[mongodbConnectionUrl] = db;
        cb(null, dbs[mongodbConnectionUrl]);
        return;
      }
      cb(err, null);
    });
  }
};

module.exports = getConnection;
