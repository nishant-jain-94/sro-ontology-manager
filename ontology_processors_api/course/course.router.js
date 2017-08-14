const express = require('express');
const router = express.Router();
const courseController = require('./course.controller.js');

router.get('/', (req, res, next) => {
    let pageOptions = {
        page: req.query.page ? req.query.page : 1,
        maxResults: 20
    };

    courseController.fetchAllCourses(pageOptions, (err, data) => {
        if(!err) res.json(data);
        else {
            log.err(err);
            next(err);
        };
    });
});

router.get('/:courseId/concepts', (req, res, next) => {
    let pageOptions = {
        page: req.query.page ? req.query.page : 1,
        maxResults: 20
    };

    courseController.fetchAllConceptsAssociatedWithCourse(req.params.courseId, pageOptions, (err, data) => {
        if(!err) res.json(data);
        else next(err);             
    });
});

router.get('/:courseId/contents', (req, res, next) => {
    let pageOptions = {
        page: req.query.page ? req.query.page : 1,
        maxResults: 20
    };

    courseController.fetchAllContentsAssociatedWithCourse(req.params.courseId, pageOptions, (err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

router.get('/:courseId/details', (req, res, next) => {
    let pageOptions = {
        page: req.query.page ? req.query.page : 1,
        maxResults: 1000
    };

    courseController.fetchAllRelatedItems(req.params.courseId, pageOptions, (err, data) => {
        if(!err) res.json(data);
        else next(err);
    });
});

module.exports = router;