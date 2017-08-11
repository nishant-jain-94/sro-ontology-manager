const should = require('should');
const async = require('async');

const log = require('../sro_utils/logger')('COURSE_CONTROLLER_API');
const courseController = require('./course.controller');
const {queryExecutor, createNodesAndRelationshipsFromTriple, dropAllConstraints} = require('../neo4j_utils');

describe('Course Controller', (done) => {
    before((done) => {
        done();
    });

    it('Should fetch all the courses', (done) => {

    });

    it('Should fetch all concepts associated with the course', (done) => {

    });

    it('Should fetch all the contents associated with the course', (done) => {

    });

    after((done) => {
        done();
    });
});