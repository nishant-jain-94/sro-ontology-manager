const async = require('async');
const highland = require('highland');
const should = require('should');
const relationFactory = require('./relation.factory');

const {
    queryExecutor, 
    mergeOrCreateNode, 
    mergeOrCreateRelation, 
    dropAllConstraints
} = require('./neo4j_utils');

const log = require('./sro_utils/logger');

let source = {
    properties: {
        label: 'conceptTest', 
        name: 'Javascript', 
        domain: 'frontend and backend', 
        level: 10, 
        importance: 'high'
    },
    options: {
        uniqueConstraintsOn: [
            'name'
        ]
    }
};

let target = {
    properties: {
        label: 'conceptTest', 
        name: 'AngularJS', 
        domain: 'frontend', 
        level: 10, 
        importance: 'high'
    },
    options: {
        uniqueConstraintsOn: [
            'name'
        ]
    }
};

describe("Merge or Create Relations", (done) => {
    before((done) => {
        async.series([
			dropAllConstraints,
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n'),
            mergeOrCreateNode.bind(null, source),
            mergeOrCreateNode.bind(null, target)
		], done);
    });

    it("Should create realtions if it doesn't exists", (done) => {
       const triple = {
           source: {
               properties: {
                label: 'conceptTest',
                name: 'Javascript'
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
           },
           target: {
               properties: {
                label: 'conceptTest',
                name: 'AngularJS'
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
           },
           relation: {
               properties: {
                   relation: 'subConceptOf'
                }
           },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
       };
       
       const messageWrapper = (triple) => {
           return {
               content: new Buffer(JSON.stringify(triple))
           };
       };

       highland([triple]).map(messageWrapper).through(relationFactory).collect().toArray((results) => {
            should.exist(results);
            const result = results[0][0];
            const record = result.data.records[0]; 
            record.length.should.be.exactly(3);
            const [fieldsOfSource, fieldsOfTarget, fieldsOfRelation] = record._fields;
            fieldsOfSource.labels[0].should.be.exactly('conceptTest');
            fieldsOfTarget.labels[0].should.be.exactly('conceptTest');
            fieldsOfRelation.type.should.be.exactly('subConceptOf');
            fieldsOfSource.properties.name.should.be.exactly('Javascript');
            fieldsOfTarget.properties.name.should.be.exactly('AngularJS');
            done();
       });
       

    });

    it('Should merge the properties of a relation if it already exists', (done) => {
        const triple = {
           source: {
               properties: {
                label: 'conceptTest',
                name: 'Javascript'
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
           },
           target: {
               properties: {
                label: 'conceptTest',
                name: 'AngularJS'
            },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
           },
           relation: {
               properties: {
                   relation: 'subConceptOf',
                   importance: 'high'
                },
            options: {
                uniqueConstraintsOn: [
                    'name'
                ]
            }
           }
       };

       const messageWrapper = (triple) => {
           return {
               content: new Buffer(JSON.stringify(triple))
           };
       };

       highland([triple]).map(messageWrapper).through(relationFactory).collect().toArray((results) => {
            should.exist(results);
            const result = results[0][0];
            const record = result.data.records[0];
            record.length.should.be.exactly(3);
            const [fieldsOfSource, fieldsOfTarget, fieldsOfRelation] = record._fields;
            fieldsOfSource.labels[0].should.be.exactly('conceptTest');
            fieldsOfTarget.labels[0].should.be.exactly('conceptTest');
            fieldsOfRelation.type.should.be.exactly('subConceptOf');
            fieldsOfRelation.properties.importance.should.be.exactly('high');
            fieldsOfSource.properties.name.should.be.exactly('Javascript');
            fieldsOfTarget.properties.name.should.be.exactly('AngularJS');
            done();
       });
    });

    after((done) => {
        async.series([
			dropAllConstraints, 
			queryExecutor.bind(null, 'MATCH (n) DETACH DELETE n')
		], done);
    });
}); 