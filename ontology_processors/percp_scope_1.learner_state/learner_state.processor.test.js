const _ = require('lodash');
const should = require('should');
const async = require('async');
const highland = require('highland');
const learnerStateProcessor = require('./learner_state.processor');
const mongodb = require('mongodb');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger');

describe('Create Learner State from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create Learner State from the stream', (done) => {
        const learner_state = {
            "student_id" : "amishag",
            "elements" : [
                {
                    "identifier" : "info:fedora/learning:2584",
                    "elementType" : "learningresource",
                    "isMandatory" : true,
                    "parentId" : "info:fedora/learning:1042",
                    "name" : "Unordered Lists",
                    "elementSubType" : "lecture",
                    "learningTime" : 180,
                    "proficiencyWeightage" : 1,
                    "minProficiency" : 100,
                    "offset" : 1,
                    "mediaType" : "video",
                    "_id" : new mongodb.ObjectId("58e6340e70528b2f6c86bbea"),
                    "conditions" : [ ]
                },
                {
                    "identifier" : "info:fedora/learning:7321",
                    "elementType" : "learningresource",
                    "isMandatory" : true,
                    "parentId" : "info:fedora/learning:1725",
                    "name" : "Using the Command-line Tool",
                    "elementSubType" : "lecture",
                    "learningTime" : 480,
                    "proficiencyWeightage" : 1,
                    "minProficiency" : 100,
                    "offset" : 6,
                    "mediaType" : "video",
                    "_id" : new mongodb.ObjectId("58e6340e70528b2f6c86bbeb"),
                    "state" : 2,
                    "conditions" : [ ]
                },
                {
                    "identifier" : "info:fedora/learning:7321",
                    "elementType" : "learningresource",
                    "isMandatory" : true,
                    "parentId" : "info:fedora/learning:1725",
                    "name" : "Using the Command-line Tool",
                    "elementSubType" : "lecture",
                    "learningTime" : 480,
                    "proficiencyWeightage" : 1,
                    "minProficiency" : 100,
                    "offset" : 6,
                    "mediaType" : "video",
                    "_id" : new mongodb.ObjectId("58e6340e70528b2f6c86bbeb"),
                    "state" : 1,
                    "conditions" : [ ]
                }
            ]
        };
        
        const messageWrapper = (learnerState) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(learnerState));
            return message;
        };

        highland([learner_state]).map(messageWrapper).pipe(learnerStateProcessor).collect().toArray((s) => {
            const results = _.flatten(s);
            results[0].triples.length.should.be.exactly(3);
            results[0].triples[0].source.properties.label.should.be.exactly('user');
            results[0].triples[0].source.properties.identifier.should.be.exactly('amishag');            
            results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[0].target.properties.label.should.be.exactly('content');
            results[0].triples[0].target.properties.resourceId.should.be.exactly("info:fedora/learning:2584");
            results[0].triples[0].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[0].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
            results[0].triples[0].relation.properties.relation.should.be.exactly('yetToStart');

            results[0].triples[1].source.properties.label.should.be.exactly('user');
            results[0].triples[1].source.properties.identifier.should.be.exactly('amishag');            
            results[0].triples[1].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[1].target.properties.label.should.be.exactly('content');
            results[0].triples[1].target.properties.resourceId.should.be.exactly("info:fedora/learning:7321");
            results[0].triples[1].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[1].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
            results[0].triples[1].relation.properties.relation.should.be.exactly('completed');

            results[0].triples[2].source.properties.label.should.be.exactly('user');
            results[0].triples[2].source.properties.identifier.should.be.exactly('amishag');            
            results[0].triples[2].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[2].target.properties.label.should.be.exactly('content');
            results[0].triples[2].target.properties.resourceId.should.be.exactly("info:fedora/learning:7321");
            results[0].triples[2].target.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[2].target.options.uniqueConstraintsOn[0].should.be.exactly('resourceId');
            results[0].triples[2].relation.properties.relation.should.be.exactly('started');

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