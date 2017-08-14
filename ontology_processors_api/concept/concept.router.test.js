const request = require('supertest');
const should = require('should');
const proxyquire = require('proxyquire');
const log = require('../sro_utils/logger')('CONCEPT_ROUTES_TEST.JS');
const mediaContent = require('./mediaContents.json');

const conceptRoutes = proxyquire('./concept.router.js', {
    './concept.controller.js': {
        'fetchAllTheContentsWhichExplainsThisConcept': function(concept, cb) {
            cb(null, mediaContent);
        }
    }
});

const app = proxyquire('../app', {
    './concept.routes.js': conceptRoutes
});


describe('POST /private/v1/concept/content', (done) => {
    const contentRequest = {"conceptId":"info:fedora/learning:12162","courseId":"info:fedora/learning:14243","offset":0,"limit":20}
    it('Should Fetch all the content matching the conceptId in the request object', (done) => {
    request(app)
        .post('/private/v1/concept/content')
        .type('form')
        .send(contentRequest)
        .expect(200)
        .end((err, res) => {
            should.not.exist(err);
            should.exist(res);
            res.body.length.should.be.exactly(2);
            res.body[0].identifier.should.be.exactly("info:fedora/learning:24966");
            res.body[1].identifier.should.be.exactly("info:fedora/learning:25258");
            done();
        });
    });
});