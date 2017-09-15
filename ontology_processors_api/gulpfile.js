const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

gulp.task('lint', () => gulp.src(['**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('test', () => gulp.src(['**/*.test.js', '!node_modules/**'])
  .pipe(mocha({ reporter: 'spec' }))
  .once('error', () => {
    process.exit(1);
  }));

gulp.task('default', ['lint', 'test']);
