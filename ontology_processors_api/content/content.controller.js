const log = require('../sro_utils/logger')('CONTENT_CONTROLLER_API');
const {queryExecutor} = require('../neo4j_utils');
const async = require('async');

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

const fetchContentById = (contentId, options, cb) => {
    const skip = (options.page - 1) * options.limit;
    const query = `MATCH (n:content {mediaContentId: '${contentId}'}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
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

const fetchAllRelatedItems = (contentId, options, cb) => {
    async.parallel([
        fetchContentById.bind(null, contentId, options),
        fetchRelatedConcepts.bind(null, contentId, options),
        fetchRelatedCourses.bind(null, contentId, options)
    ], (err, results) => {
        if(!err) {
            [content, concepts, courses] = results;

            let relatedConcepts = concepts.map((concept) => {
                return {
                    entityId: concept.identifier,
                    entityType: 'concepts',
                    entityName: concept.displayName
                };
            });

            let relatedCourses = courses.map((course) => {
                return {
                    entityId: course.courseId,
                    entityType: 'courses',
                    entityName: course.displayName
                }
            });

            let [contentAndItsRelatedEntities] = content.map((content) => {
                return {
                    entityId: content.mediaContentId,
                    entityType: 'contents',
                    entityName: content.displayName,
                    relatedGroups: [
                        {
                            name: 'concepts',
                            entities: relatedConcepts
                        },
                        {
                            name: 'courses',
                            entities: relatedCourses
                        }
                    ]
                }
            });

            cb(null, contentAndItsRelatedEntities)
        } else {
            cb(err, null);
        }
    });
};

module.exports = {
    fetchAllContents,
    fetchRelatedConcepts,
    fetchRelatedCourses,
    fetchAllRelatedItems
};