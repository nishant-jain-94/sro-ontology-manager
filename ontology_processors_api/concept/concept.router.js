const express = require('express');
const router = express.Router();
const conceptController = require('./concept.controller.js');
const log = require('../sro_utils/logger')('CONCEPT.ROUTES.JS');

const PAGE_NUMBER = 1;
const LIMIT_RESULTS = 20;

router.post('/content', (req, res, next) => {
    conceptController.fetchAllTheContentsWhichExplainsThisConcept(req.body, (err, data) => {
        if(!err) {
            res.json(data);
        } else {
            log.error(err);            
            next();   
        }
    });
});

router.get('/', (req, res, next) => {
    let options = {
        page: req.query.page ? req.query.page : 1,
        limit: req.query.limit ? req.query.limit: LIMIT_RESULTS
    };
    conceptController.fetchAllConcepts(options, (err, data) => {
        if(!err) {
            res.json(data);
        } else {
            log.error(err);
            next(err);
        }
    });
});

router.get('/:conceptId/contents', (req, res, next) => {
    let options = {
        page: req.query.page ? req.query.page : 1,
        limit: req.query.limit ? req.query.limit: LIMIT_RESULTS
    };
    conceptController.fetchAllTheAssociatedContents(req.params.conceptId, options, (err, contents) => {
        if(!err) {
            res.json(contents);
        } else {
            log.error(err);
            next(err);
        }
    });
});

router.get('/:conceptId/subconcepts', (req, res, next) => {
    let options = {
        page: req.query.page ? req.query.page : 1,
        limit: req.query.limit ? req.query.limit: LIMIT_RESULTS
    };
    conceptController.fetchAllTheSubConcepts(req.params.conceptId, options, (err, concepts) => {
        if(!err) {
            res.json(concepts)
        } else {
            log.error(err);
            next(err);
        }
    });
});

module.exports = router;