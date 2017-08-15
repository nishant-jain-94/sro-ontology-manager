const _ = require('lodash');
const async = require('async');
const log = require('../sro_utils/logger')('CONCEPT_CONTROLLER_API');
const {queryExecutor} = require('../neo4j_utils');
const {getMongoDBConnection} = require('../mongo_utils');

const fetchConceptMapForTheCourse = (course, cb) => {
    const query = `MATCH (m:course {courseId: "${course.courseId}"})<-[:usedIn]-(n:content)-[:explains]-(p:concept)<-[:subconcept]-(q:concept) WITH collect(DISTINCT p.conceptId) as concepts, collect(DISTINCT q.conceptId) as subconcepts return [x in concepts where not(x in subconcepts)] as delta`;
    queryExecutor(query, (err, data) => {
        if(!err) {
            // log.debug(data);
            const conceptList = data.records[0]._fields[0];
            log.debug(conceptList);
            getMongoDBConnection('percp_scope_1', (err, db) => {
                log.debug({db: db});
                db.collection('concepts').find({identifier: { $in: conceptList }}).toArray((err, concepts) => {
                    log.debug(concepts);
                });
            });
        };
    });
};

const fetchCourseById = (courseId, options, cb) => {
    const skip = (options.page - 1) * options.maxResults; 
    const query = `MATCH (n:course {courseId: '${courseId}'}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.maxResults}`;
    queryExecutor(query, (err, result) => {
        if(err) return cb(err, null);
        else {
            const courses = result.records.map((record) => record._fields[0].properties);
            return cb(null, courses);
        }
    });
};

const fetchAllCourses = (options, cb) => {
    const skip = (options.page - 1) * options.maxResults; 
    const query = `MATCH (n:course) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.maxResults}`;
    queryExecutor(query, (err, result) => {
        if(err) return cb(err, null);
        else {
            const courses = result.records.map((record) => record._fields[0].properties);
            return cb(null, courses);
        }
    });
};

const fetchAllConceptsAssociatedWithCourse = (courseId, options, cb) => {
    const skip = (options.page - 1) * options.maxResults; 
    const query = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(n:resource)-[:explains]->(p:concept) return DISTINCT p ORDER BY p.name SKIP ${skip} LIMIT ${options.maxResults}`;
    queryExecutor(query, (err, result) => {
        if(err) return cb(err, null);
        else {
            const concepts = result.records.map((record) => record._fields[0].properties);
            return cb(null, concepts);
        }
    });
};

const fetchAllContentsAssociatedWithCourse = (courseId, options, cb) => {
    const skip = (options.page - 1) * options.maxResults;
    const queryToFetchContentsLinkedThroughResources = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(n:resource)-[:aggregates]->(p:content) return DISTINCT p ORDER BY p.mediaContentId SKIP ${skip} LIMIT ${options.maxResults}`;
    const queryToFetchContentsLinkedDirectlyWithCourse = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(p:content) return DISTINCT p ORDER BY p.mediaContentId SKIP ${skip} LIMIT ${options.maxResults}`;
    async.parallel([
        queryExecutor.bind(null, queryToFetchContentsLinkedThroughResources),
        queryExecutor.bind(null, queryToFetchContentsLinkedDirectlyWithCourse)
    ], (err, results) => {
        if(!err) {
            [contentsLinkedThroughResources, contentsLinkedDirectlyWithCourse] = results;
            
            const updatedContentsLinkedThroughResources = contentsLinkedThroughResources.records.map((records) => {
                let contentProperties = records._fields[0].properties;
                contentProperties.isLinkedWithResource = true;
                return contentProperties;
            });

            const updatedContentsLinkedDirectlyWithCourse = contentsLinkedDirectlyWithCourse.records.map((records) => {
                let contentProperties = records._fields[0].properties;
                contentProperties.isLinkedWithResource = false;
                return contentProperties;
            });

            const contents = _.concat(updatedContentsLinkedDirectlyWithCourse, updatedContentsLinkedThroughResources);
            return cb(null, contents);
        } else {
            return cb(err, null);
        }
    });
};

const fetchAllRelatedItems = (courseId, options, cb) => {
    async.parallel([
        fetchCourseById.bind(null, courseId, options),
        fetchAllConceptsAssociatedWithCourse.bind(null, courseId, options),
        fetchAllContentsAssociatedWithCourse.bind(null, courseId, options)
    ], (err, results) => {
        if(!err) {
            [course, concepts, contents] = results;
            
            let relatedConcepts = concepts.map((concept) => {
                return {
                    entityId: concept.identifier,
                    entityType: 'concepts',
                    entityName: concept.displayName
                };
            });

            let relatedContents = contents.map((content) => {
                return {
                    entityId: content.mediaContentId,
                    entityType: 'contents',
                    entityName: content.displayName?content.displayName:'Not Available'
                }
            });
            
            let [courseAndItsRelatedEntities] = course.map((course) => {
                return {
                    entityId: course.courseId,
                    entityType: 'courses',
                    entityName: course.displayName,
                    relatedGroups: [{
                        name: 'concepts',
                        entities: relatedConcepts
                    }, {
                        name: 'contents',
                        entities: relatedContents
                    }]
                };
            });

            cb(null, courseAndItsRelatedEntities);
        }
        else {
            cb(err, null);
        }
    });
};

module.exports = {
    fetchConceptMapForTheCourse: fetchConceptMapForTheCourse,
    fetchAllCourses: fetchAllCourses,
    fetchAllConceptsAssociatedWithCourse: fetchAllConceptsAssociatedWithCourse,
    fetchAllContentsAssociatedWithCourse: fetchAllContentsAssociatedWithCourse,
    fetchAllRelatedItems: fetchAllRelatedItems
};