require('should');
const _ = require('lodash');
const async = require('async');
const highland = require('highland');
const questionProcessor = require('./questions.processor');
const mongodb = require('mongodb');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger')('Question_Processor_Test');

describe('Create conceptNodes from Stream', () => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create content nodes from the Question Stream', (done) => {
        
        const question = {
            "_id" : new mongodb.ObjectId("5976d23b2ff5abb70bf0748a"),
            "identifier" : "ASMNTITEMILQA1i257",
            "status" : "false",
            "cognitiveLevel" : "",
            "metadata" : "",
            "reservedForExam" : false,
            "attachments" : "",
            "copyRight" : "Canopus",
            "owner" : "Canopus",
            "offerredBy" : "Canopus",
            "languageCode" : "",
            "description" : "",
            "title" : "",
            "knowledgeDimension" : "",
            "semanticDensity" : null,
            "learningGoals" : "",
            "learnerLevel" : "",
            "studyLevel" : "",
            "testUsage" : "",
            "concepts" : "Links",
            "duration" : "10",
            "subPurpose" : "",
            "purpose" : "Knowledge",
            "learningElements" : "info:fedora/learning:3404",
            "difficultyLevel" : "Easy",
            "possibleMarks" : 1,
            "questionSubtype" : "MCQ",
            "questionType" : "Objective",
            "questionFeedback" : "",
            "feedback6" : "",
            "answer6" : "",
            "feedback5" : "",
            "answer5" : "",
            "feedback4" : "",
            "answer4" : "<p>none of the above</p>",
            "feedback3" : "",
            "answer3" : "<pre><code>&lt;!anchor&gt;&lt;/anchor&gt;  \r\n</code></pre>",
            "feedback2" : "",
            "answer2" : "<pre><code>&lt;a&gt;&lt;/a&gt;\r\n</code></pre>",
            "feedback1" : "",
            "answer1" : "<pre><code>&lt;anchor&gt;&lt;/anchor&gt;   \r\n</code></pre>",
            "correctAnswer" : "<pre><code>&lt;a&gt;&lt;/a&gt;\r\n</code></pre>",
            "question" : "<p>Which of the following tag is used for creating hyperlinks with other pages?</p>",
            "__v" : 0
        };

        const messageWrapper = (question) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(question));
            return message;
        };

        highland([question]).map(messageWrapper).pipe(questionProcessor).collect().toArray((s) => {
            const results = _.flatten(s);
            log.debug({s:s});
            results[0].triples[0].source.properties.label.should.be.exactly('question');
            results[0].triples[0].source.properties.identifier.should.be.exactly("ASMNTITEMILQA1i257");
            results[0].triples[0].source.properties.learningElements.should.be.exactly("info:fedora/learning:3404");
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