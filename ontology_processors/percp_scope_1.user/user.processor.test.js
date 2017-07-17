const _ = require('lodash');
const async = require('async');
const should = require('should');
const highland = require('highland');

const userProcessor = require('./user.processor');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger');

describe('Create conceptNodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create user nodes from the stream', (done) => {
        const users = [
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
        
        const messageWrapper = (user) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(user));
            return message;
        };

        highland(users).map(messageWrapper).pipe(userProcessor).collect().toArray((s) => {
            triples = s[0][0].triples;
            log.debug(triples[0]);
            triples[0].source.properties.label.should.be.exactly('user:student');
            triples[0].source.properties.userType.should.be.exactly('student');
            triples[0].source.properties.identifier.should.be.exactly('bathriv');
            triples[0].source.properties.uniqueId.should.be.exactly("bathri.v93@wipro.com");
            triples[0].source.properties.displayName.should.be.exactly("Bathri_V");
            triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('uniqueId');
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