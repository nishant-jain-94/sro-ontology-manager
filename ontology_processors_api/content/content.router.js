const express = require('express');
const router = express.Router();
const contentController = require('./content.controller');

const PAGE_NUMBER = 1;
const LIMIT_RESULTS = 20;

router.get('/', (req, res, next) => {    
    let options = {
        page: req.query.page?req.query.page:PAGE_NUMBER,
        limit: req.query.limit?req.query.limit:LIMIT_RESULTS
    };

    contentController.fetchAllContents(options, (err, data) => {
        if(!err) res.json(data)
        else {
            log.error(err);
            next(err);
        }
    });
});

router.get('/:contentId/concepts', (req, res, next) => {
    let options = {
        page: req.query.page ? req.query.page:PAGE_NUMBER,
        limit: req.query.limit ? req.query.limit:LIMIT_RESULTS
    };

    contentController.fetchRelatedConcepts(req.params.contentId, options, (err, data) => {
        if(!err) res.json(data)
        else {
            log.error(err);
            next(err);
        }
    });
});

router.get('/:contentId/courses', (req, res, next) => {
    let options = {
        page: req.query.page ? req.query.page:PAGE_NUMBER,
        limit: req.query.limit?req.query.limit:LIMIT_RESULTS
    };
    contentController.fetchRelatedCourses(req.params.contentId, options, (err, data) => {
        if(!err) res.json(data)
        else {
            log.error(err);
            next(err);
        }
    });
});

module.exports = router;
