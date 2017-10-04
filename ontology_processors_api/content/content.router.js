const express = require('express');
const log = require('../commons/logger');
const contentController = require('./content.controller');

const router = express.Router();

const PAGE_NUMBER = 1;
const LIMIT_RESULTS = 1000;

router.get('/', (req, res, next) => {
  const options = {
    page: req.query.page ? req.query.page : PAGE_NUMBER,
    limit: req.query.limit ? req.query.limit : LIMIT_RESULTS,
  };

  contentController.fetchAllContents(options, (err, data) => {
    if (!err) res.json(data);
    else {
      log.error(err);
      next(err);
    }
  });
});

router.get('/:contentId/concepts', (req, res, next) => {
  const options = {
    page: req.query.page ? req.query.page : PAGE_NUMBER,
    limit: req.query.limit ? req.query.limit : LIMIT_RESULTS,
  };

  contentController.fetchRelatedConcepts(req.params.contentId, options, (err, data) => {
    if (!err) res.json(data);
    else {
      log.error(err);
      next(err);
    }
  });
});

router.get('/:contentId/courses', (req, res, next) => {
  const options = {
    page: req.query.page ? req.query.page : PAGE_NUMBER,
    limit: req.query.limit ? req.query.limit : LIMIT_RESULTS,
  };
  contentController.fetchRelatedCourses(req.params.contentId, options, (err, data) => {
    if (!err) res.json(data);
    else {
      log.error(err);
      next(err);
    }
  });
});

router.get('/:contentId/details', (req, res, next) => {
  const pageOptions = {
    page: req.query.page ? req.query.page : 1,
    limit: 1000,
  };

  contentController.fetchAllRelatedItems(req.params.contentId, pageOptions, (err, data) => {
    if (!err) res.json(data);
    else next(err);
  });
});

module.exports = router;
