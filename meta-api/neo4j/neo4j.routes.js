var express = require('express');
var router = express.Router();
var neo4jController = require('./neo4j.controller');

router.get('/neo4jHealthStatus', function (req, res, next) {
    neo4jController.getNeo4jStatus((err, data) => {
      if(!err) res.json(data);
      else next(err);
    });
  });
  
router.get('/neo4jData', function (req, res, next) {
    neo4jController.getNeo4jData((err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

module.exports = router;
