const _ = require('lodash');
const should = require('should');
const async = require('async');
const highland = require('highland');
const concepts = require('./concept.processor');
const {deleteAllNodes, dropAllConstraints} = require('./neo4j_utils');
const log  = require('./sro_utils/logger')('Concept_Processor_Test');

describe('Create conceptNodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });
    
    it('Should create concept nodes from the stream', (done) => {
        const conceptOplogs = [
            {
                "v" : 2,
                "op" : "i",
                "ns" : "percp_scope_1.concepts",
                "o" : {
                    "title" : "Daemon",
                    "context" : "Java software programming",
                    "identifier" : "info:fedora/learning:16467",
                    "categoryCounts" : [ ],
                    "contentCategories" : [ ],
                    "associations" : [
                        {
                            "conceptTitle" : "RMI Daemon",
                            "conceptId" : "info:fedora/learning:11382",
                            "tag" : "subconcept",
                        }
                    ],
                    "description" : "",
                    "metadata" : {
                        "node_type" : "NODE",
                        "object_uri" : "info:fedora/learning:16467",
                        "setType" : "concept",
                        "nodeId" : "JAVA:183",
                        "context" : "Java software programming",
                        "identifier" : "info:fedora/learning:16467",
                        "description" : "Daemon: Java software programming: Web programming",
                        "descriptionVerified" : false,
                        "object_type" : "concept",
                        "title" : "Daemon"
                    }
                }
            },
            {
                "v" : 2,
                "op" : "i",
                "ns" : "percp_scope_1.concepts",
                "o" : {
                    "title" : "Deadlock",
                    "context" : "Java software programming",
                    "identifier" : "info:fedora/learning:16613",
                    "categoryCounts" : [ ],
                    "contentCategories" : [ ],
                    "associations" : [ ],
                    "description" : "",
                    "metadata" : {
                        "node_type" : "NODE",
                        "object_uri" : "info:fedora/learning:16613",
                        "setType" : "concept",
                        "nodeId" : "JAVA:193",
                        "context" : "Java software programming",
                        "identifier" : "info:fedora/learning:16613",
                        "description" : "Deadlock: Java software programming: Web programming",
                        "descriptionVerified" : false,
                        "object_type" : "concept",
                        "title" : "Deadlock"
                    }
                }
            },
            {
                "v" : 2,
                "op" : "i",
                "ns" : "percp_scope_1.concepts",
                "o" : {
                    "title" : "Dependency Scope",
                    "context" : "Maven Java Programming",
                    "identifier" : "info:fedora/learning:16811",
                    "categoryCounts" : [ ],
                    "contentCategories" : [ ],
                    "associations" : [
                        {
                            "conceptTitle" : "Test Dependency",
                            "conceptId" : "info:fedora/learning:19599",
                            "tag" : "subconcept"
                        },
                        {
                            "conceptTitle" : "Compile Time Dependency",
                            "conceptId" : "info:fedora/learning:15335",
                            "tag" : "subconcept"
                        },
                        {
                            "conceptTitle" : "Provided Dependency",
                            "conceptId" : "info:fedora/learning:10893",
                            "tag" : "subconcept"
                        }
                    ],
                    "description" : "",
                    "metadata" : {
                        "node_type" : "NODE",
                        "object_uri" : "info:fedora/learning:16811",
                        "setType" : "concept",
                        "nodeId" : "JAVA:203",
                        "context" : "Maven Java Programming",
                        "identifier" : "info:fedora/learning:16811",
                        "description" : "Dependency Scope: Maven Java Programming: Web programming",
                        "descriptionVerified" : false,
                        "object_type" : "concept",
                        "title" : "Dependency Scope"
                    }
                }
            },
            {
                "v" : 2,
                "op" : "i",
                "ns" : "percp_scope_1.concepts",
                "o" : {
                    "title" : "Delete",
                    "context" : "Java software programming",
                    "identifier" : "info:fedora/learning:16746",
                    "categoryCounts" : [ ],
                    "contentCategories" : [ ],
                    "associations" : [ ],
                    "description" : "",
                    "metadata" : {
                        "node_type" : "NODE",
                        "object_uri" : "info:fedora/learning:16746",
                        "setType" : "concept",
                        "nodeId" : "JAVA:198",
                        "context" : "Java software programming",
                        "identifier" : "info:fedora/learning:16746",
                        "description" : "Delete: Java software programming: Web programming",
                        "descriptionVerified" : false,
                        "object_type" : "concept",
                        "title" : "Delete"
                    }
                }
            }
        ];
        
        const messageWrapper = (oplog) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(oplog.o));
            return message;
        };

        highland(conceptOplogs).map(messageWrapper).pipe(concepts).collect().toArray((s) => {
            should.exist(s);
            const results = s[0]
            results.length.should.be.exactly(4);
            results[0].triples.length.should.be.exactly(1);
            results[1].triples.length.should.be.exactly(1);
            results[2].triples.length.should.be.exactly(3);
            results[3].triples.length.should.be.exactly(1);
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