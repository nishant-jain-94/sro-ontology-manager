const _ = require('lodash');
const should = require('should');
const async = require('async');
const highland = require('highland');
const courseProcessor = require('./course.processor');
const {
    deleteAllNodes,
    dropAllConstraints
} = require('./neo4j_utils');
const log = require('./sro_utils/logger')('Course_Processor_Test');

describe('Create courseNodes from Stream', (done) => {
    before((done) => {
        async.series([
            deleteAllNodes,
            dropAllConstraints
        ], done);
    });

    it('Should create course nodes from the stream', (done) => {
        const courses = [{
                "_id": "58e62ec470528b2f6c86b9ba",
                "status": "draft",
                "packageSequenceId": "info:fedora/learning:5227",
                "hoursOfVideo": 60,
                "hoursPerWeek": 15,
                "weeksDuration": 7,
                "homeDescription": "A full stack program focussing on the JavaScript stack. The core curriculum focuses on building complete Reactive apps. You build front-ends using AngularJS or React along with Bootstrap, HTMl5/CSS3 and Material or Semantic UI. You wire these front-end apps to microservice based backends built using technologies like NodeJS, Express, Seneca. You do a lot of async programming with message based models and NodeJS streams. You also work on databses like MongoDB, Cassandra and Neo4J. In addition, and perhaps more importantly, you learn what it takes to work in a truly automated project environment with test first thinking and small and distributed project teams. This is an extremely experiential course - your demonstration of competency is fundamentally in the code you write and the tech that you develop. Expect to build complete non-trivial applications as part of small, virtual project groups.",
                "image": "http://learn.stackroute.in/uploads/image/webdev2.png",
                "pedagogyId": "info:fedora/learning:240",
                "description": "\"A full stack program focussing on the JavaScript stack. The core curriculum focuses on building complete Reactive apps. You build front-ends using AngularJS or React along with Bootstrap, HTMl5/CSS3 and Material or Semantic UI. You wire these front-end apps to microservice based backends built using technologies like NodeJS, Express, Seneca. You do a lot of async programming with message based models and NodeJS streams. You also work on databses like MongoDB, Cassandra and Neo4J. In addition, and perhaps more importantly, you learn what it takes to work in a truly automated project environment with test first thinking and small and distributed project teams. This is an extremely experiential course - your demonstration of competency is fundamentally in the code you write and the tech that you develop. Expect to build complete non-trivial applications as part of small, virtual project groups.\"",
                "name": "Full Stack ME(A/R)N Programmer",
                "nodeId": "MEAN101W:1",
                "identifier": "info:fedora/learning:4693",
                "community": {
                    "userId": "course4693",
                    "coachGroup": {
                        "groupId": "tsppt5wuTXmXBF3cpTwwdw",
                        "groupMembers": []
                    },
                    "facultyGroup": {
                        "groupId": "i7vw3W5OSq-t8gCvQbWyYg",
                        "groupMembers": [
                            "saching",
                            "satishs"
                        ]
                    }
                },
                "is_deleted": false,
                "outcomeSequence": [],
                "packageSequence": [],
                "packages": [],
                "tutors": [{
                    "name": "Jayaprasad K",
                    "identifier": "info:fedora/learning:780",
                    "description": "\"JP loves programming. He is a problem solver, who has a simple and elegant answer to any programming problem that you may face. He has been part of multiple technology teams and startups, where he had an opportunity to create products from scratch, and go through high paced learning environments. He loves working with engineers and help them solve problems. \"",
                    "image": "http://learn.stackroute.in/uploads/image/JP.png",
                    "_id": "58e62ec670528b2f6c86bb22"
                }],
                "order": 1,
                "introduction": {
                    "videoMimeType": "video/youtube",
                    "videoURL": "https://youtu.be/PigAmso52kI",
                    "text": "\"A full stack program focussing on the JavaScript stack. The core curriculum focuses on building complete Reactive apps. You build front-ends using AngularJS or React along with Bootstrap, HTMl5/CSS3 and Material or Semantic UI. You wire these front-end apps to microservice based backends built using technologies like NodeJS, Express, Seneca. You do a lot of async programming with message based models and NodeJS streams. You also work on databses like MongoDB, Cassandra and Neo4J. In addition, and perhaps more importantly, you learn what it takes to work in a truly automated project environment with test first thinking and small and distributed project teams. This is an extremely experiential course - your demonstration of competency is fundamentally in the code you write and the tech that you develop. Expect to build complete non-trivial applications as part of small, virtual project groups.\""
                },
                "faculty": {
                    "image": "http://learn.stackroute.in/uploads/image/sachin.png",
                    "description": "\"Sachin is an experienced MEAN practitioner\"",
                    "identifier": "info:fedora/learning:6978",
                    "name": "Sachin Grover"
                },
                "inboxEmailId": "production_courses@app.ilimi.in"
            }
        ];

        const messageWrapper = (course) => {
            const message = {};
            message["content"] = new Buffer(JSON.stringify(course));
            return message;
        };

        highland(courses).map(messageWrapper).pipe(courseProcessor).collect().toArray((s) => {
            should.exist(s);
            const results = _.flatten(s);
            results[0].triples[0].source.properties.label.should.be.exactly('course');
            results[0].triples[0].source.properties.courseId.should.be.exactly("info:fedora/learning:4693");
            results[0].triples[0].source.options.uniqueConstraintsOn.length.should.be.exactly(1);
            results[0].triples[0].source.options.uniqueConstraintsOn[0].should.be.exactly('courseId');
            done();
        });
    });
});