// const _ = require('lodash');
// const async = require('async');
// const should = require('should');
// const highland = require('highland');

// const mediaProcessor = require('./media_content.processor');
// const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
// const log  = require('./sro_utils/logger');

// describe('Create mediaNodes from Stream', (done) => {
//     before((done) => {
//         async.series([
//             deleteAllNodes,
//             dropAllConstraints
//         ], done);
//     });
    
//     it('Should create Media Content nodes from the Stream', (done) => {
//         const media = [
//             {
//                 "_id" : ObjectId("58e62ec370528b2f6c86b728"),
//                 "metadata" : {
//                     "node_type" : "NODE",
//                     "object_uri" : "info:fedora/learning:1908",
//                     "setType" : "content",
//                     "nodeId" : "8mksN0bcr8",
//                     "codeName" : "",
//                     "description" : "",
//                     "language" : "",
//                     "keyword" : "",
//                     "offeredBy" : "",
//                     "popularity" : "",
//                     "rating" : "",
//                     "completionResult" : "",
//                     "classificationStream" : "",
//                     "classificationSubject" : "",
//                     "isMandatory" : "",
//                     "structure" : "",
//                     "aggregationLevel" : "",
//                     "currentStatus" : "",
//                     "currentVersion" : "",
//                     "versionDate" : "",
//                     "versionNumber" : "",
//                     "versionRole" : "",
//                     "versionPerson" : "",
//                     "versionStatus" : "",
//                     "owner" : "",
//                     "copyRight" : "",
//                     "cost" : "",
//                     "contributors" : "",
//                     "annotationRecord" : "",
//                     "format" : "",
//                     "size" : "",
//                     "location" : "",
//                     "duration" : "",
//                     "purpose" : "",
//                     "studyLevel" : "",
//                     "learnerLevel" : "",
//                     "intendedEndUserRole" : "",
//                     "difficultyLevel" : "",
//                     "interactivityType" : "",
//                     "context" : "",
//                     "learningTime" : 0,
//                     "semanticDensity" : "",
//                     "elementType" : "",
//                     "knowledgeDimension" : "",
//                     "bloomsTaxonomyLevel" : "",
//                     "instructionUsage" : "",
//                     "interactivityLevel" : "",
//                     "interactivityLocation" : "",
//                     "intervention" : "",
//                     "interventionRole" : "",
//                     "collaboration" : "",
//                     "evaluationType" : "",
//                     "learningStyle" : "",
//                     "placeInContainer" : "",
//                     "lessonType" : "",
//                     "tutoringMode" : "",
//                     "tutorType" : "",
//                     "tutorLearnerRatio" : "",
//                     "categorizeByLP" : "",
//                     "tutorHoursByProfile" : "",
//                     "tutorLanguage" : "",
//                     "tutorLRTypes" : "",
//                     "programTemplate" : "",
//                     "programAnswer" : "",
//                     "image" : "",
//                     "minProficiency" : "",
//                     "proficiencyWeightage" : "",
//                     "author" : "",
//                     "authorImage" : "",
//                     "authorProfileURL" : "",
//                     "ownerType" : "",
//                     "ownerImage" : "",
//                     "ownerProfileURL" : "",
//                     "offeredByType" : "",
//                     "offeredByImage" : "",
//                     "offeredByProfileURL" : "",
//                     "extendedMaterial" : false,
//                     "outcome" : "",
//                     "contentSource" : "",
//                     "shortDescription" : "",
//                     "synopsis" : "",
//                     "homeDescription" : "",
//                     "weeksDuration" : "",
//                     "hoursPerWeek" : "",
//                     "hoursOfVideo" : "",
//                     "objectives" : "",
//                     "projectDescription" : "",
//                     "projectImage" : "",
//                     "organizationName" : "",
//                     "organizationType" : "",
//                     "organizationURL" : "",
//                     "organizationImage" : "",
//                     "price" : "",
//                     "tutoringHours" : "",
//                     "conceptMapImage" : "",
//                     "startDate" : "",
//                     "endDate" : "",
//                     "timeUnit" : "",
//                     "offset" : "",
//                     "createdBy" : "",
//                     "showOnHomePage" : "",
//                     "packagesequenceid" : "",
//                     "outcomesequenceid" : "",
//                     "posterurl" : "",
//                     "height" : "",
//                     "width" : "",
//                     "packagefolder" : "",
//                     "startfile" : "",
//                     "title" : "",
//                     "mediaurl" : "",
//                     "mediatype" : "",
//                     "mimetype" : "",
//                     "ismain" : "",
//                     "contentid" : "",
//                     "media" : "",
//                     "latype" : "",
//                     "usageid" : "",
//                     "questionpaperid" : "",
//                     "mediaid" : "",
//                     "concepts" : "",
//                     "packageerror" : "",
//                     "identifier" : "info:fedora/learning:1908",
//                     "category" : "main",
//                     "descriptionVerified" : false,
//                     "type" : ""
//                 },
//                 "pedagogyId" : "info:fedora/learning:240",
//                 "identifier" : "info:fedora/learning:1908",
//                 "is_deleted" : false,
//                 "interceptions" : [ ],
//                 "mediaConcepts" : [ ],
//                 "concepts" : [ ],
//                 "subtitles" : [ ],
//                 "transcripts" : [ ],
//                 "categories" : [
//                     "main"
//                 ],
//                 "media" : [
//                     {
//                         "title" : "Deleting Attributes",
//                         "mediaUrl" : "https://niitams.streaming.mediaservices.windows.net/5caf13e1-f039-4c80-97b8-136ffa2f0f6d/video2_5.ism/manifest(format=mpd-time-csf)",
//                         "mimeType" : "application/dash+xml",
//                         "mediaType" : "video",
//                         "mediaId" : "info:fedora/learning:3917",
//                         "isMain" : true,
//                         "_id" : ObjectId("58e62ec470528b2f6c86ba25")
//                     }
//                 ],
//                 "order" : 0,
//                 "linkedCourses" : [
//                     "info:fedora/learning:4693",
//                     "info:fedora/learning:8570"
//                 ],
//                 "contentType" : "lecture"
//             }
//         ];
        
//         const messageWrapper = (media) => {
//             const message = {};
//             message["content"] = new Buffer(JSON.stringify(media));
//             return message;
//         };

//         highland(media).map(messageWrapper).map(mediaProcessor).collect().toArray((s) => {
//             log.debug({s:s});
//             _.flattenDeep(s).length.should.be.exactly(1);
//             done();
//         });
//     });
    
//     after((done) => {
//         async.series([
//             deleteAllNodes,
//             dropAllConstraints
//         ], done);
//     });
// });