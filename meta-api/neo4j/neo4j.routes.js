// # Neo4j Router

// ## neo4j.routes.js

// The routes ued for API endpoints for Neo4j

// Imports the required dependencies
var express = require('express');
var router = express.Router();
var neo4jController = require('./neo4j.controller');

// GET `neo4jHealthStatus`
// To get the health status of Neo4j
router.get('/neo4jHealthStatus', function (req, res, next) {
    neo4jController.getNeo4jStatus((err, data) => {
      if(!err) res.json(data);
      else next(err);
    });
  });
  
// GET `neo4jData`
//  To get Neo4j data like number of nodes and number of relationships
router.get('/neo4jData', function (req, res, next) {
    neo4jController.getNeo4jData((err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

// Exporting the router
module.exports = router;
