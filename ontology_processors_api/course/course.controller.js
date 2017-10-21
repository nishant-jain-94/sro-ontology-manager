const _ = require('lodash');
const async = require('async');
const log = require('../commons/logger');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const { getMongoDBConnection } = require('../mongo_utils');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

const fetchConceptMapForTheCourse = (course) => {
  const query = `MATCH (m:course {courseId: "${course.courseId}"})<-[:usedIn]-(n:content)-[:explains]-(p:concept)<-[:subconcept]-(q:concept) WITH collect(DISTINCT p.conceptId) as concepts, collect(DISTINCT q.conceptId) as subconcepts return [x in concepts where not(x in subconcepts)] as delta`;
  neo4j.queryExecutor(query, (err, data) => {
    if (!err) {
      // log.debug(data);
      const conceptList = data.records[0]._fields[0];
      log.debug(conceptList);
      getMongoDBConnection('percp_scope_1', (db) => {
        log.debug({ db });
        db.collection('concepts').find({ identifier: { $in: conceptList } }).toArray((concepts) => {
          log.debug(concepts);
        });
      });
    }
  });
};

const fetchCourseById = (courseId, options, cb) => {
  const skip = (options.page - 1) * options.maxResults;
  const query = `MATCH (n:course {courseId: '${courseId}'}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.maxResults}`;
  neo4j.queryExecutor(query, (err, result) => {
    if (err) return cb(err, null);

    const courses = result.records.map(record => record._fields[0].properties);
    return cb(null, courses);
  });
};

const fetchAllCourses = (options, cb) => {
  const skip = (options.page - 1) * options.maxResults;
  const query = `MATCH (n:course) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.maxResults}`;
  neo4j.queryExecutor(query, (err, result) => {
    if (err) return cb(err, null);

    const courses = result.records.map(record => record._fields[0].properties);
    return cb(null, courses);
  });
};

const search = (searchTerm, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (m:content) where m.name CONTAINS '${searchTerm}' OR m.displayName CONTAINS '${searchTerm}' or m.url CONTAINS '${searchTerm}' return DISTINCT m ORDER BY m.courseId SKIP ${skip} LIMIT ${options.limit}`;
  neo4j.queryExecutor(query, (err, result) => {
    if(err) return cb(err, null);
    const courses = result.records.map(record => record._fields[0].properties);
    return cb(null, courses);
  });
};

const fetchAllConceptsAssociatedWithCourse = (courseId, options, cb) => {
  const skip = (options.page - 1) * options.maxResults;
  const query = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(n:resource)-[:explains]->(p:concept) return DISTINCT p ORDER BY p.name SKIP ${skip} LIMIT ${options.maxResults}`;
  neo4j.queryExecutor(query, (err, result) => {
    if (err) return cb(err, null);

    const concepts = result.records.map(record => record._fields[0].properties);
    return cb(null, concepts);
  });
};

const fetchAllContentsAssociatedWithCourse = (courseId, options, cb) => {
  const skip = (options.page - 1) * options.maxResults;
  const queryToFetchContentsLinkedThroughResources = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(n:resource)-[:aggregates]->(p:content) return DISTINCT p ORDER BY p.mediaContentId SKIP ${skip} LIMIT ${options.maxResults}`;
  const queryToFetchContentsLinkedDirectlyWithCourse = `MATCH (m:course {courseId: '${courseId}'})<-[:usedIn]-(p:content) return DISTINCT p ORDER BY p.mediaContentId SKIP ${skip} LIMIT ${options.maxResults}`;
  async.parallel([
    neo4j.queryExecutor.bind(neo4j, queryToFetchContentsLinkedThroughResources),
    neo4j.queryExecutor.bind(neo4j, queryToFetchContentsLinkedDirectlyWithCourse),
  ], (err, results) => {
    if (!err) {
      const [contentsLinkedThroughResources, contentsLinkedDirectlyWithCourse] = results;

      const updatedContentsLinkedThroughResources =
      contentsLinkedThroughResources.records.map((records) => {
        const contentProperties = records._fields[0].properties;
        contentProperties.isLinkedWithResource = true;
        return contentProperties;
      });

      const updatedContentsLinkedDirectlyWithCourse =
      contentsLinkedDirectlyWithCourse.records.map((records) => {
        const contentProperties = records._fields[0].properties;
        contentProperties.isLinkedWithResource = false;
        return contentProperties;
      });

      const contents =
      _.concat(updatedContentsLinkedDirectlyWithCourse, updatedContentsLinkedThroughResources);

      return cb(null, contents);
    }
    return cb(err, null);
  });
};

const fetchAllRelatedItems = (courseId, options, cb) => {
  async.parallel([
    fetchCourseById.bind(null, courseId, options),
    fetchAllConceptsAssociatedWithCourse.bind(null, courseId, options),
    fetchAllContentsAssociatedWithCourse.bind(null, courseId, options),
  ], (err, results) => {
    if (!err) {
      const [courses, concepts, contents] = results;

      const relatedConcepts = concepts.map(concept => ({
        entityId: concept.identifier,
        entityType: 'concepts',
        entityName: concept.displayName,
      }));

      const relatedContents = contents.map(content => ({
        entityId: content.mediaContentId,
        entityType: 'contents',
        entityName: content.displayName ? content.displayName : 'Not Available',
      }));

      const [courseAndItsRelatedEntities] = courses.map(course => ({
        entityId: course.courseId,
        entityType: 'courses',
        entityName: course.displayName,
        relatedGroups: [{
          name: 'concepts',
          entities: relatedConcepts,
        }, {
          name: 'contents',
          entities: relatedContents,
        }],
      }));

      cb(null, courseAndItsRelatedEntities);
    } else {
      cb(err, null);
    }
  });
};

module.exports = {
  fetchConceptMapForTheCourse,
  fetchAllCourses,
  fetchAllConceptsAssociatedWithCourse,
  fetchAllContentsAssociatedWithCourse,
  fetchAllRelatedItems,
};
