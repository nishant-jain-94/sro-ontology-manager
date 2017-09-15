const Neo4jWrapper = require('simple-neo4j-wrapper');
const async = require('async');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

class ContentController {}

ContentController.executeQueryAndFetchResults = (query, cb) => {
  neo4j.queryExecutor(query, (err, result) => {
    if (!err) {
      const records = result.records.map(record => record._fields[0].properties);
      cb(null, records);
    } else {
      cb(err, null);
    }
  });
};

ContentController.fetchAllContents = (options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (n:content) return n ORDER BY n.mediaContentId SKIP ${skip} LIMIT ${options.limit}`;
  ContentController.executeQueryAndFetchResults(query, cb);
};

ContentController.fetchContentById = (contentId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (n:content {mediaContentId: '${contentId}'}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  ContentController.executeQueryAndFetchResults(query, cb);
};

ContentController.fetchRelatedConcepts = (contentId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (m:content {mediaContentId: '${contentId}'})-[:explains]->(n:concept) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  ContentController.executeQueryAndFetchResults(query, cb);
};

ContentController.fetchRelatedCourses = (contentId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (m:content {mediaContentId: '${contentId}'})-[:usedIn]->(n:course) return n ORDER BY n.courseId SKIP ${skip} LIMIT ${options.limit}`;
  ContentController.executeQueryAndFetchResults(query, cb);
};

ContentController.fetchAllRelatedItems = (contentId, options, cb) => {
  async.parallel([
    ContentController.fetchContentById.bind(null, contentId, options),
    ContentController.fetchRelatedConcepts.bind(null, contentId, options),
    ContentController.fetchRelatedCourses.bind(null, contentId, options),
  ], (err, results) => {
    if (!err) {
      const [contents, concepts, courses] = results;

      const relatedConcepts = concepts.map(concept => ({
        entityId: concept.identifier,
        entityType: 'concepts',
        entityName: concept.displayName,
      }));

      const relatedCourses = courses.map(course => ({
        entityId: course.courseId,
        entityType: 'courses',
        entityName: course.displayName,
      }));

      const [contentAndItsRelatedEntities] = contents.map(content => ({
        entityId: content.mediaContentId,
        entityType: 'contents',
        entityName: content.displayName,
        relatedGroups: [
          {
            name: 'concepts',
            entities: relatedConcepts,
          },
          {
            name: 'courses',
            entities: relatedCourses,
          },
        ],
      }));

      cb(null, contentAndItsRelatedEntities);
    } else {
      cb(err, null);
    }
  });
};


module.exports = ContentController;
