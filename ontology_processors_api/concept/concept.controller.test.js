const should = require('should');
const async = require('async');

const log = require('../sro_utils/logger')('CONCEPT_CONTROLLER_API');
const {getMongoDBConnection} = require('../mongo_utils');
const conceptController = require('./concept.controller');
const {queryExecutor, createNodesAndRelationsFromTriple, dropAllConstraints} = require('../neo4j_utils');

const mediaContent = {
	        "metadata": {},
            "pedagogyId": "info:fedora/learning:240",
            "description": "",
            "name": "Component-based software engineering",
            "identifier": "TwoWayBinding:102",
            "is_deleted": false,
            "interceptions": [],
            "mediaConcepts": [],
            "concepts": [{
                "conceptTitle": "Two Way Binding",
                "conceptIdentifier": "info:fedora/learning:12162",
                "_id": "54dcd6be2ff5495f08e6ee20"
            }, {
                "conceptTitle": "Software Engineering",
                "conceptIdentifier": "info:fedora/learning:13335",
                "_id": "54dcd6c92ff5495f08e70740"
            }],
            "subtitles": [],
            "transcripts": [],
            "categories": ["references"],
            "media": [{
                "title": "Two Way Binding",
                "mediaUrl": "http://en.wikipedia.org/wiki/Component-based_software_engineering",
                "mimeType": "url",
                "mediaType": "url",
                "mediaId": "info:fedora/learning:31253",
                "isMain": true,
                "_id": "54dcd6a12ff5495f08e6bcb0"
            }],
            "order": 6000,
            "linkedCourses": [""],
            "facultyRecommended": false,
            "mediaType": "url",
            "mainCategory": "references",
            "addedToPath": false,
            "shortId": "learning:24966"
        };

const triple = {
    propertiesOfSubject: {
        label: 'content',
        name: 'Article_On_TwoWayBinding',
        contentId: 'TwoWayBinding:102'
    },
    propertiesOfObject: {
        label: 'concept',
        name: 'TwoWayBinding',
        conceptId: 'TwoWayBinding:101'
    },
    propertiesOfPredicate: {
        relation: 'explains'
    }
};


const createMediaContentInMongoDB = (mediaContent, cb) => {
    getMongoDBConnection('percp_scope_1', (err, db) => {
        db.collection('media_content').insert(mediaContent, cb);
    });
};

const deleteMediaContentFromMongoDB = (mediaContent, cb) => {
    getMongoDBConnection('percp_scope_1', (err, db) => {
        db.collection('media_content').remove(mediaContent, cb);
    });
};

describe('Content Controller', (done) => {
    before((done) => {
        async.series([
            dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n'),
            deleteMediaContentFromMongoDB.bind(null, mediaContent),
            createNodesAndRelationsFromTriple.bind(null, triple),
            createMediaContentInMongoDB.bind(null, mediaContent)
        ], done)
    });


    it('Should List All The Content Ids Which Explains This Concept', (done) => {
        conceptController.listAllTheContentIdsWhichExplainsThisConceptFromGraphDB(triple.propertiesOfObject, (err, data) => {
            should.not.exist(err);
            should.exist(data);
            data[0].should.be.exactly('TwoWayBinding:102');
            done();
        });
    });

    it('Should Find All The Content Matching a List Of Ids.', (done) => {
        conceptController.fetchAllTheContentsMatchingListOfContentIdsFromMongoDB(['TwoWayBinding:102'], (err, data) => {
            should.not.exist(err);
            should.exist(data);
            data.length.should.be.exactly(1);
            data[0].name.should.be.exactly('Component-based software engineering');
            data[0].identifier.should.be.exactly('TwoWayBinding:102');
            done();
        });
    });

    it('Should Find All The Content Documents Which Explains This Concept', (done) => {
        conceptController.fetchAllTheContentsWhichExplainsThisConcept(triple.propertiesOfObject, (err, data) => {
            should.not.exist(err);
            should.exist(data);
            data.length.should.be.exactly(1);
            data[0].name.should.be.exactly('Component-based software engineering');
            data[0].identifier.should.be.exactly('TwoWayBinding:102');
            done();
        });
    });

    after((done) => {
        async.series([
            dropAllConstraints,
            queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n'),
            deleteMediaContentFromMongoDB.bind(null, mediaContent)
        ], done);
    });
});

