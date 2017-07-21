const gulp = require('gulp');
const merge = require('gulp-merge');
const print = require('gulp-print');
const gutil = require('gulp-util');
const docco = require('gulp-docco');
 
const docsDestination = "docs";

const ontologyBroker = gulp.src([
    'ontology_broker/**/*.js',
    '!ontology_broker/amqp_utils{,/**/*}',
    '!ontology_broker/neo4j_utils{,/**/*}',
    '!ontology_broker/sro_utils{,/**/*}',
    '!ontology_broker/logs{,/**/*}',    
    '!ontology_broker/node_modules{,/**/*}'
]);

const ontologyProcessors = gulp.src([
    'ontology_processors/**/*.js',
    '!ontology_processors/node_modules{,/**/*}',
    '!ontology_processors/**/node_modules{,/**/*}',
    '!ontology_processors/**/neo4j_utils{,/**/*}',
    '!ontology_processors/**/sro_utils{,/**/*}',
    '!ontology_processors/**/amqp_utils{,/**/*}'
]);

const ontologyProcessorsNeo4j = gulp.src([
    'ontology_processors_neo4j/**/*.js',
    '!ontology_processors_neo4j/node_modules{,/**/*}',
    '!ontology_processors_neo4j/**/node_modules{,/**/*}',
    '!ontology_processors_neo4j/**/neo4j_utils{,/**/*}',
    '!ontology_processors_neo4j/**/sro_utils{,/**/*}',
    '!ontology_processors_neo4j/**/amqp_utils{,/**/*}'
]);

gulp.task('create-docs', () => {
    merge(ontologyBroker, ontologyProcessors, ontologyProcessorsNeo4j)
    .pipe(docco())
    .pipe(gulp.dest(docsDestination));
});