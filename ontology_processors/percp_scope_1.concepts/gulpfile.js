const fs = require('fs');
const path = require('path');
const gulp  = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const reporter = require('eslint-html-reporter');

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**', '!amqp_utils/**', '!sro_utils/**', '!coverage/**', '!neo4j_utils/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.format(reporter, (results) => {
            fs.writeFileSync(path.join(__dirname, 'eslint-results.html'), results);
        }))
        .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
    return gulp.src(['**/*.test.js', '!node_modules/**', '!amqp_utils/**', '!sro_utils/**', '!coverage/**', '!neo4j_utils/**'])
        .pipe(mocha({reporter: 'nyan', timeout: 5000}))
        .once('error', () => {
            process.exit(1);
        });
});

gulp.task('default', ['lint', 'test']);