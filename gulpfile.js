'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');

gulp.task('sass', function () {
  return gulp.src('./tests/example/css/style.scss')
    .pipe(sass())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./tests/example/css/style.css'));
});