const async = require('async');
const log = require('../commons/logger');
const Neo4jWrapper = require('simple-neo4j-wrapper');
const { getMongoDBConnection } = require('../mongo_utils');
const { NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD } = require('../config');

const neo4j = new Neo4jWrapper(NEO4J_URL, NEO4J_USERNAME, NEO4J_PASSWORD);

class ConceptController {}

ConceptController.executeQueryAndFetchResults = (query, cb) => {
  log.debug('Original Funtion');
  neo4j.queryExecutor(query, (err, data) => {
    if (!err) {
      const records = data.records.map(record => record._fields[0].properties);
      cb(null, records);
    } else {
      cb(err, null);
    }
  });
};

ConceptController.fetchConceptMapForTheCourse = (course, cb) => {
  const query = `MATCH (m:course)-[:usedIn]-(n:content)-[:explains]-(p:concept)-[:subconcept]-(q:concept)
  WITH 
  collect(DISTINCT p) as concepts
  collect(DISTINCT q) as subconcepts
  return (x in concepts where not(x in subconcepts)) as delta`;
  console.log(query);
  ConceptController.executeQueryAndFetchResults(query, cb);
};

ConceptController.listAllTheContentIdsWhichExplainsThisConceptFromGraphDB = (conceptId, cb) => {
  const query = `MATCH (n:content)-[:explains]->(m:concept {conceptId: "${conceptId}"}) return n`;
  console.log(query);
  neo4j.queryExecutor(query, (err, data) => {
    if (!err) {
      const listOfContentIds = data.records.map(record => record._fields[0].properties.contentId);
      cb(null, listOfContentIds);
    } else {
      cb(err, null);
    }
  });
};

ConceptController.fetchAllTheContentsMatchingListOfContentIdsFromMongoDB =
 (listOfContentIds, cb) => {
   getMongoDBConnection('percp_scope_1', (err, db) => {
     db.collection('media_content').find({ identifier: { $in: listOfContentIds } }).toArray(cb);
   });
 };

ConceptController.fetchAllTheContentsWhichExplainsThisConceptFromMongoDB = (conceptId, cb) => {
  async.waterfall([
    ConceptController.listAllTheContentIdsWhichExplainsThisConceptFromGraphDB.bind(null, conceptId),
    ConceptController.fetchAllTheContentsMatchingListOfContentIdsFromMongoDB,
  ], cb);
};

ConceptController.fetchAllConcepts = (options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (n:concept) RETURN n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  console.log(query);
  ConceptController.executeQueryAndFetchResults(query, cb);
};

ConceptController.fetchAllTheAssociatedContents = (conceptId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  log.debug(options);
  const queryToFetchAssociatedContentsThroughResource = `MATCH \
  (n:content)<-[:aggregates]-(:resource)-[:explains]->(m:concept {identifier: "${conceptId}"}) \
  return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  console.log(queryToFetchAssociatedContentsThroughResource);
  const queryToFetchContentsDirectlyLinkedToConcepts = `MATCH \
  (n:content)-[:explains]->(m:concept {identifier: "${conceptId}"}) \
  return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  console.log(queryToFetchContentsDirectlyLinkedToConcepts);
  async.parallel([
    ConceptController
      .executeQueryAndFetchResults
      .bind(null, queryToFetchAssociatedContentsThroughResource),
    ConceptController
      .executeQueryAndFetchResults
      .bind(null, queryToFetchContentsDirectlyLinkedToConcepts),
  ], (err, results) => {
    let mergedResults;
    if (!err) {
      mergedResults = [].concat(...results);
    }
    cb(err, mergedResults);
  });
};

ConceptController.fetchAllTheSubConcepts = (conceptId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (n:concept {identifier: "${conceptId}"})<-[:subconcept]-(m:concept) return m ORDER BY m.name SKIP ${skip} LIMIT ${options.limit}`;
  console.log(query);
  ConceptController.executeQueryAndFetchResults(query, cb);
};

ConceptController.fetchConceptById = (conceptId, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (n:concept {identifier: "${conceptId}"}) return n ORDER BY n.name SKIP ${skip} LIMIT ${options.limit}`;
  console.log(query);
  ConceptController.executeQueryAndFetchResults(query, cb);
};

ConceptController.search = (searchTerm, options, cb) => {
  const skip = (options.page - 1) * options.limit;
  const query = `MATCH (m:concept) where m.name CONTAINS '${searchTerm}' OR m.displayName CONTAINS '${searchTerm}' or m.url CONTAINS '${searchTerm}' return DISTINCT m ORDER BY m.courseId SKIP ${skip} LIMIT ${options.limit}`;
  ConceptController.executeQueryAndFetchResults(query, cb);
};

ConceptController.fetchAllRelatedItems = (conceptId, options, cb) => {
  async.parallel([
    ConceptController.fetchConceptById.bind(null, conceptId, options),
    ConceptController.fetchAllTheAssociatedContents.bind(null, conceptId, options),
    ConceptController.fetchAllTheSubConcepts.bind(null, conceptId, options),
  ], (err, results) => {
    if (!err) {
      const [concepts, contents, subconcepts] = results;

      const relatedContents = contents.map(content => ({
        entityId: content.mediaContentId,
        entityType: 'contents',
        entityName: content.displayName ? content.displayName : 'Not Available',
      }));

      const relatedSubConcepts = subconcepts.map(subconcept => ({
        entityId: subconcept.identifier,
        entityType: 'concepts',
        entityName: subconcept.displayName,
      }));

      const [conceptAndItsRelatedEntities] = concepts.map(concept => ({
        entityId: concept.identifier,
        entityType: 'concepts',
        entityName: concept.displayName,
        relatedGroups: [
          {
            name: 'subconcepts',
            entities: relatedSubConcepts,
          },
          {
            name: 'contents',
            entities: relatedContents,
          },
        ],
      }));
      cb(null, conceptAndItsRelatedEntities);
    } else cb(err, null);
  });
};

module.exports = ConceptController;
