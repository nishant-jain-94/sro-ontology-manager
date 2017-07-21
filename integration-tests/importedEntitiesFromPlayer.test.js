const fs = require('fs');
const path = require('path');
const async = require('async');
const csv = require('fast-csv');
const should = require('should');

const {normalize} = require('../sro_utils');
const {findNodes} = require('../neo4j_utils');
const log = require('../sro_utils/logger')("ImportedEntitiesFromPlayer");
const csvOptions = {
    objectMode: true,
    headers: true
};

let n = "IBM Open Cloud - IBM Cloud Computing - United States"

log.debug(n.normalize());

let conceptRecordsNotFound = [];
let contentRecordsNotFound = [];
let      = [];
let totalConceptNodes = 0;
let totalContentNodes = 0;
let totalCleanedContentNodes = 0;

describe('Integration Test', () => {
    it('Should have all the concept nodes imported from the csv file using perceptron player', (done) => {
        const findNodeOperations = [];
        csv.fromPath(path.join(__dirname,'../data/cloud_concepts_final.csv'), csvOptions)
        .on('data', (data) => {
            const node = {
                label: 'concept',
                name: data.Name.normalize()
            };
            totalConceptNodes++;
            findNodeOperations.push(findNodes.bind(null, node));
        })
        .on('end', () => {
            async.parallel(findNodeOperations, (err, results) => {
                results.forEach((result) => {
                    if(result.records.length < 1) {
                        conceptRecordsNotFound.push(result);
                    }
                });
                // log.debug({records:conceptRecordsNotFound});
                fs.writeFileSync(path.join(__dirname, './notFoundConceptNodes.json'), JSON.stringify(conceptRecordsNotFound));
                log.debug(`Total Concept Nodes ${totalConceptNodes}`);
                log.debug(`Concept Nodes Not Found in Graph ${conceptRecordsNotFound.length}`);
                done();
            });
        });
    });

    it('Should have all the content nodes imported from the csv file using perceptron player', (done) => {
        const findNodeOperations = [];
        csv.fromPath(path.join(__dirname,'../data/cloud course_1423743638000.csv'), csvOptions)
        .on('data', (data) => {
            if(undefined !== typeof data.name && data['node type'] === 'content' ) {
                const node = {
                    label: 'content',
                    name: data.name.normalize()
                };
                totalContentNodes++;
                findNodeOperations.push(findNodes.bind(null, node));
            }
        })
        .on('end', () => {
            async.parallel(findNodeOperations, (err, results) => {
                results.forEach((result) => {
                    if(result.records.length < 1) {
                        contentRecordsNotFound.push(result);
                    }
                });
                fs.writeFileSync(path.join(__dirname, './notFoundContentNodes.json'), JSON.stringify(contentRecordsNotFound));
                log.debug(`Total Content Nodes ${totalContentNodes}`);
                log.debug(`Content Nodes Not Found in Graph ${contentRecordsNotFound.length}`);
                done();
            });
        });
    });

    it('Should have all the cleaned content nodes imported from the csv file using perceptron player', (done) => {
        const findNodeOperations = [];
        csv.fromPath(path.join(__dirname,'../data/cloud_course_results_with_summaries_cleanedup.csv'), csvOptions)
        .on('data', (data) => {
            if(undefined !== typeof data.name && data['node type'] === 'Content' ) {
                const node = {
                    label: 'content',
                    name: data.name.normalize()
                };
                totalCleanedContentNodes++;
                findNodeOperations.push(findNodes.bind(null, node));
            }
        })
        .on('end', () => {
            async.parallel(findNodeOperations, (err, results) => {
                results.forEach((result) => {
                    if(result.records.length < 1) {
                        cleanedContentRecordsNotFound.push(result);
                    }
                });
                fs.writeFileSync(path.join(__dirname, './notFoundCleanedContentNodes.json'), JSON.stringify(contentRecordsNotFound));
                log.debug(`Total Content Nodes ${totalCleanedContentNodes}`);
                log.debug(`Content Nodes Not Found in Graph ${cleanedContentRecordsNotFound.length}`);
                done();
            });
        });
    });
});


