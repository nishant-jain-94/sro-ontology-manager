const async = require('async');
const log = require('../sro_utils/logger')('CONCEPT_CONTROLLER_API');
const {queryExecutor} = require('../neo4j_utils');
const {getMongoDBConnection} = require('../mongo_utils');

const fetchConceptMapForTheCourse = (course, cb) => {
    const query = `MATCH (m:course)-[:usedIn]-(n:content)-[:explains]-(p:concept)-[:subconcept]-(q:concept)
                   WITH 
                   collect(DISTINCT p) as concepts
                   collect(DISTINCT q) as subconcepts
                   return (x in concepts where not(x in subconcepts)) as delta`;
    queryExecutor(query, (err, data) => {
        if(!err) {
            log.debug(data);
        }
    });
};

const listAllTheContentIdsWhichExplainsThisConceptFromGraphDB = (conceptId, cb) => {
    const query = `MATCH (n:content)-[:explains]->(m:concept {conceptId: "${conceptId}"}) return n`;
    queryExecutor(query, (err, data) => {
        if(!err) {
            const listOfContentIds = data.records.map((record) => {
                return record._fields[0].properties.contentId;
            });
            cb(null, listOfContentIds);
        } else  {
            cb(err, null);
        }
    });
};

const fetchAllTheContentsMatchingListOfContentIdsFromMongoDB = (listOfContentIds, cb) => {
    getMongoDBConnection('percp_scope_1', (err, db) => {
        db.collection('media_content').find({identifier: { $in : listOfContentIds }}).toArray(cb);
    });
};

const fetchAllTheContentsWhichExplainsThisConcept = (conceptId, cb) => {
    async.waterfall([
        listAllTheContentIdsWhichExplainsThisConceptFromGraphDB.bind(null, conceptId),
        fetchAllTheContentsMatchingListOfContentIdsFromMongoDB
    ], cb);
};

const fetchAllConcepts = (options, cb) => {
    const skip = (options.page - 1) * options.limit; 
    const query = `MATCH (n:concept) RETURN n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, result) => {
        if(!err) {
            const records = result.records.map((record) => record._fields[0].properties)
            cb(null, records);
        } else {
            cb(err, null);
        }
    });
};

const fetchAllTheAssociatedContents = (conceptId, options, cb) => {
    const skip = (options.page - 1) * options.limit;
    log.debug(options);    
    const query = `MATCH (n:content)-[:explains]->(m:concept {identifier: "${conceptId}"}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, data) => {
        if(!err) {
            const listOfContents = data.records.map((record) => {
                return record._fields[0].properties;
            });
            cb(null, listOfContents);
        } else  {
            cb(err, null);
        }
    });
};

const fetchAllTheSubConcepts = (conceptId, options, cb) => {
    const skip = (options.page - 1) * options.limit;     
    const query = `MATCH (n:concept {identifier: "${conceptId}"})<-[:subconcept]-(m:concept) return m ORDER BY m.name SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, data) => {
        if(!err) {
            const listOfSubConcepts = data.records.map((record) => {
                return record._fields[0].properties;
            });
            cb(null, listOfSubConcepts)
        } else {
            cb(err, null)
        }
    });
};

module.exports = {
    fetchAllConcepts,
    fetchAllTheAssociatedContents,
    fetchAllTheSubConcepts,
    listAllTheContentIdsWhichExplainsThisConceptFromGraphDB,
    fetchAllTheContentsMatchingListOfContentIdsFromMongoDB,
    fetchAllTheContentsWhichExplainsThisConcept
};
