const _ = require('lodash');
const should = require('should');
const async = require('async');
const highland = require('highland');
const learningResourceProcessor = require('./learning_resource.processor');
const mongodb = require('mongodb');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger');

describe('Create conceptNodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create concept nodes from the stream', (done) => {
    const learning_resource =    {
            "_id" : new mongodb.ObjectId("58e62ec370528b2f6c86b706"),
            "metadata" : {
                "node_type" : "NODE",
                "object_uri" : "info:fedora/learning:5194",
                "setType" : "learningresource",
                "nodeId" : "5kIXpIWQv6",
                "codeName" : "",
                "description" : "<p>In this video,Learn how to create radio buttons and checkbox elements and what the difference is between the two.</p>",
                "language" : "",
                "keyword" : "",
                "offeredBy" : "",
                "popularity" : "",
                "rating" : "",
                "completionResult" : "",
                "classificationStream" : "",
                "classificationSubject" : "",
                "isMandatory" : true,
                "structure" : "",
                "aggregationLevel" : "",
                "currentStatus" : "",
                "currentVersion" : "",
                "versionDate" : "",
                "versionNumber" : "",
                "versionRole" : "",
                "versionPerson" : "",
                "versionStatus" : "",
                "owner" : "",
                "copyRight" : "",
                "cost" : "",
                "contributors" : "",
                "annotationRecord" : "",
                "format" : "",
                "size" : "",
                "location" : "",
                "duration" : "",
                "purpose" : "Knowledge",
                "studyLevel" : "",
                "learnerLevel" : "",
                "intendedEndUserRole" : "",
                "difficultyLevel" : "",
                "interactivityType" : "",
                "context" : "",
                "learningTime" : 540,
                "semanticDensity" : "",
                "elementType" : "",
                "knowledgeDimension" : "",
                "bloomsTaxonomyLevel" : "Remember",
                "instructionUsage" : "lecture",
                "interactivityLevel" : "",
                "interactivityLocation" : "",
                "intervention" : "",
                "interventionRole" : "",
                "collaboration" : "",
                "evaluationType" : "",
                "learningStyle" : "",
                "placeInContainer" : "",
                "lessonType" : "",
                "tutoringMode" : "",
                "tutorType" : "",
                "tutorLearnerRatio" : "",
                "categorizeByLP" : "",
                "tutorHoursByProfile" : "",
                "tutorLanguage" : "",
                "tutorLRTypes" : "",
                "programTemplate" : "",
                "programAnswer" : "",
                "image" : "",
                "minProficiency" : "100",
                "proficiencyWeightage" : "1",
                "author" : "",
                "authorImage" : "",
                "authorProfileURL" : "",
                "ownerType" : "",
                "ownerImage" : "",
                "ownerProfileURL" : "",
                "offeredByType" : "",
                "offeredByImage" : "",
                "offeredByProfileURL" : "",
                "extendedMaterial" : "",
                "outcome" : "",
                "contentSource" : "",
                "shortDescription" : "",
                "synopsis" : "",
                "homeDescription" : "",
                "weeksDuration" : "",
                "hoursPerWeek" : "",
                "hoursOfVideo" : "",
                "objectives" : "",
                "projectDescription" : "",
                "projectImage" : "",
                "organizationName" : "",
                "organizationType" : "",
                "organizationURL" : "",
                "organizationImage" : "",
                "price" : "",
                "tutoringHours" : "",
                "conceptMapImage" : "",
                "startDate" : "",
                "endDate" : "",
                "timeUnit" : "",
                "offset" : "",
                "createdBy" : "",
                "showOnHomePage" : "",
                "packagesequenceid" : "",
                "outcomesequenceid" : "",
                "posterurl" : "",
                "height" : "",
                "width" : "",
                "packagefolder" : "",
                "startfile" : "",
                "title" : "",
                "mediaurl" : "",
                "mediatype" : "",
                "mimetype" : "",
                "ismain" : "",
                "contentid" : "",
                "media" : "",
                "latype" : "",
                "usageid" : "",
                "questionpaperid" : "",
                "mediaid" : "",
                "concepts" : "",
                "packageerror" : "",
                "identifier" : "info:fedora/learning:5194",
                "descriptionVerified" : false,
                "type" : ""
            },
            "learningTime" : 540,
            "minProficiency" : 100,
            "isMandatory" : true,
            "nodeSet" : "learningresource",
            "name" : "Creating radio buttons and checkbox elements",
            "courseId" : "info:fedora/learning:4693",
            "identifier" : "info:fedora/learning:5194",
            "is_deleted" : false,
            "supplementary_content" : [ ],
            "concepts" : [ ],
            "conditions" : [ ],
            "completionCriteria" : [ ],
            "preConditions" : [ ],
            "learningObjectives" : [ ],
            "nodeSetId" : "info:fedora/learning:244",
            "taxonomyId" : "info:fedora/learning:114",
            "lobId" : "info:fedora/learning:8385",
            "contentIdentifier" : "info:fedora/learning:8732"
        };

        
        const messageWrapper = (learnerState) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(learning_resource));
            return message;
        };

        highland([learning_resource]).map(messageWrapper).pipe(learningResourceProcessor).collect().toArray((s) => {
            const results = _.flatten(s);
            results[0].triples[0].source.properties.label.should.be.exactly('content');
            results[0].triples[0].source.properties.resourceId.should.be.exactly("info:fedora/learning:5194");
            results[0].triples[0].source.properties.mediaContentId.should.be.exactly("info:fedora/learning:8732");
            results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('mediaContentId');
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