const _ = require('lodash');
const async = require('async');
const should = require('should');
const highland = require('highland');

const mediaProcessor = require('./media.processor');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger');

describe('Create mediaNodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create user nodes from the stream', (done) => {
        const media = [
            {
                "displayName" : "Bathri V",
                "userType" : "student",
                "registered" : true,
                "uniqueId" : "bathri.v93@wipro.com",
                "metadata" : {
                    "isValid" : true,
                    "errorLog" : "",
                    "deleteStatus" : "",
                    "uniqueid" : "bathri.v93@wipro.com",
                    "programStream" : "",
                    "stream" : "",
                    "college" : "",
                    "degree" : "",
                    "yearOfGraduation" : "",
                    "organizationImage" : "",
                    "organization" : "",
                    "workExperience" : "",
                    "skills" : "",
                    "laptop" : "",
                    "computerScienceSpecializations" : "",
                    "programmingToolsUsed" : "",
                    "programmingProficiency" : "",
                    "website" : "",
                    "github" : "",
                    "googleplus" : "",
                    "twitter" : "",
                    "facebook" : "",
                    "linkedin" : "",
                    "speakingLanguages" : "",
                    "location" : "",
                    "gender" : "",
                    "address" : "",
                    "contactNumber" : "",
                    "description" : "",
                    "image" : "",
                    "email" : "bathri.v93@wipro.com",
                    "employee" : "",
                    "familyName" : "V",
                    "batch" : "1",
                    "middleName" : "",
                    "givenName" : "Bathri",
                    "type" : "student"
                },
                "inboxEmailId" : "bathriv@perceptronnetwork.com",
                "identifier" : "bathriv",
                "is_deleted" : false,
                "roles" : [
                    "student"
                ],
                "local" : {
                    "email" : "bathri.v93@wipro.com",
                    "password" : "$2a$08$qG1PgnO.oM3weIUlfk3O7eN./tDpKiu3lm9qPqgwzVuI.N9pVIzcy"
                },
                "social_info" : {
                    "linkedin" : "",
                    "facebook" : "",
                    "twitter" : "",
                    "github" : ""
                },
                "name" : {
                    "givenName" : "Bathri",
                    "familyName" : "V",
                    "middleName" : ""
                },
                "__v" : 0,
                "termsAndConditions" : {
                    "accept" : true,
                }
            }
        ];
        
        const messageWrapper = (media) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(media));
            return message;
        };

        highland(media).map(messageWrapper).pipe(mediaProcessor).collect().toArray((s) => {
            log.debug(s);
            _.flattenDeep(s).length.should.be.exactly(1);
            done();
        });
    });
    
    after((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
});