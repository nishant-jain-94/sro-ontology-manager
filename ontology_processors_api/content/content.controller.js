const log = require('../sro_utils/logger')('CONTENT_CONTROLLER_API');
const {queryExecutor} = require('../neo4j_utils');

const fetchAllContents = (options, cb) => {
    const skip = (options.page - 1) * options.limit;
    const query = `MATCH (n:content) return n ORDER BY n.mediaContentId SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, result) => {
        if(!err) {
            const records = result.records.map((record) => record._fields[0].properties)
            cb(null, records);
        } else {
            cb(err, null);
        }
    });
};

const fetchRelatedConcepts = (contentId, options, cb) => {
    const skip = (options.page - 1) * options.limit;
    const query = `MATCH (m:content {mediaContentId: '${contentId}'})-[:explains]->(n:concept) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, result) => {
        if(!err) {
            const records = result.records.map((record) => record._fields[0].properties)
            cb(null, records);
        } else {
            cb(err, null);
        }
    });
};

const fetchRelatedCourses = (contentId, options, cb) => {
    const skip = (options.page - 1) * options.limit;
    const query = `MATCH (m:content {mediaContentId: '${contentId}'})-[:usedIn]->(n:course) return n ORDER BY n.courseId SKIP ${skip} LIMIT ${options.limit}`;
    queryExecutor(query, (err, result) => {
        if(!err) {
            const records = result.records.map((record) => record._fields[0].properties)
            cb(null, records);
        } else {
            cb(err, null);
        }
    });
};

module.exports = {
    fetchAllContents,
    fetchRelatedConcepts,
    fetchRelatedCourses
};