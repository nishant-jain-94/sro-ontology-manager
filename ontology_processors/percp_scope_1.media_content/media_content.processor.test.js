const _ = require('lodash');
const async = require('async');
const should = require('should');
const highland = require('highland');
const mongodb = require('mongodb');
const mediaProcessor = require('./media_content.processor');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger')('MEDIA_CONTENT_PROCESSOR');

describe('Create Media Content Nodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should Create Media Content Nodes from the Stream', (done) => {
        const media = [
            {
                "_id" : new mongodb.ObjectId("58e62ec370528b2f6c86b728"),
                "metadata" : {
                    "node_type" : "NODE",
                    "object_uri" : "info:fedora/learning:1908",
                    "setType" : "content",
                    "nodeId" : "8mksN0bcr8",
                    "codeName" : "",
                    "description" : "",
                    "language" : "",
                    "keyword" : "",
                    "offeredBy" : "",
                    "popularity" : "",
                    "rating" : "",
                    "completionResult" : "",
                    "classificationStream" : "",
                    "classificationSubject" : "",
                    "isMandatory" : "",
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
                    "purpose" : "",
                    "studyLevel" : "",
                    "learnerLevel" : "",
                    "intendedEndUserRole" : "",
                    "difficultyLevel" : "",
                    "interactivityType" : "",
                    "context" : "",
                    "learningTime" : 0,
                    "semanticDensity" : "",
                    "elementType" : "",
                    "knowledgeDimension" : "",
                    "bloomsTaxonomyLevel" : "",
                    "instructionUsage" : "",
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
                    "minProficiency" : "",
                    "proficiencyWeightage" : "",
                    "author" : "",
                    "authorImage" : "",
                    "authorProfileURL" : "",
                    "ownerType" : "",
                    "ownerImage" : "",
                    "ownerProfileURL" : "",
                    "offeredByType" : "",
                    "offeredByImage" : "",
                    "offeredByProfileURL" : "",
                    "extendedMaterial" : false,
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
                    "identifier" : "info:fedora/learning:1908",
                    "category" : "main",
                    "descriptionVerified" : false,
                    "type" : ""
                },
                "pedagogyId" : "info:fedora/learning:240",
                "identifier" : "info:fedora/learning:1908",
                "is_deleted" : false,
                "interceptions" : [ ],
                "mediaConcepts" : [ ],
                "concepts" : [ {
                    "conceptIdentifier": 'info:fedora/learning:7177',
                    "conceptTitle": 'Properties in Javascript'
                }],
                "subtitles" : [ ],
                "transcripts" : [ ],
                "categories" : [
                    "main"
                ],
                "media" : [
                    {
                        "title" : "Deleting Attributes",
                        "mediaUrl" : "https://niitams.streaming.mediaservices.windows.net/5caf13e1-f039-4c80-97b8-136ffa2f0f6d/video2_5.ism/manifest(format=mpd-time-csf)",
                        "mimeType" : "application/dash+xml",
                        "mediaType" : "video",
                        "mediaId" : "info:fedora/learning:3917",
                        "isMain" : true,
                        "_id" : new mongodb.ObjectId("58e62ec470528b2f6c86ba25")
                    }
                ],
                "order" : 0,
                "linkedCourses" : [
                    "info:fedora/learning:4693",
                    "info:fedora/learning:8570"
                ],
                "contentType" : "lecture"
            }
        ];
        
        const messageWrapper = (media) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(media));
            return message;
        };

        highland(media).map(messageWrapper).pipe(mediaProcessor).collect().toArray((s) => {
            s.length.should.be.exactly(1);
            should.exist(s[0][0].triples);
            log.debug({triples: s[0][0].triples});
            var {source, target, relation} = s[0][0].triples[0];
            source.properties.label.should.be.exactly("content");
            source.properties.name.should.be.exactly("Deleting_Attributes");
            source.properties.contentType.should.be.exactly("lecture");
            source.properties.contentSubType.should.be.exactly("None");
            source.properties.mongoId.should.be.exactly("58e62ec370528b2f6c86b728");
            source.options.uniqueConstraintsOn[0].should.be.exactly("mediaContentId");
            target.properties.label.should.be.exactly("concept");
            target.properties.name.should.be.exactly("Properties in Javascript");
            target.properties.conceptId.should.be.exactly("info:fedora/learning:7177");
            target.options.uniqueConstraintsOn[0].should.be.exactly("name");
            relation.properties.relation.should.be.exactly("explains");
            relation.options.uniqueConstraintsOn[0].should.be.exactly('relation');
            
            var {source, target, relation} = s[0][0].triples[1];
            source.properties.label.should.be.exactly("content");
            source.properties.name.should.be.exactly("Deleting_Attributes");
            source.properties.contentType.should.be.exactly("lecture");
            source.properties.contentSubType.should.be.exactly("None");
            source.properties.mongoId.should.be.exactly("58e62ec370528b2f6c86b728");
            source.options.uniqueConstraintsOn[0].should.be.exactly("mediaContentId");
            target.properties.label.should.be.exactly("course");
            target.properties.courseId.should.be.exactly("info:fedora/learning:4693");
            target.options.uniqueConstraintsOn[0].should.be.exactly("identifier");
            relation.properties.relation.should.be.exactly("usedIn");
            relation.options.uniqueConstraintsOn[0].should.be.exactly('relation');
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