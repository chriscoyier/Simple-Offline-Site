var gulp = require('gulp');
var sass = require('gulp-sass');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('compress', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('js/min'));
});

gulp.task('dist-sw', ['compress'], function() {
  return gulp.src(['js/min/service-worker.js'])
    .pipe(concat('service-worker.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat', function() {
  return gulp.src(['js/min/jquery.js', 'js/min/global.js'])
    .pipe(concat('global.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('svgstore', function () {
  return gulp
    .src('images/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(cheerio(function ($) {
      $('svg').attr('display', 'none');
    }))
    .pipe(gulp.dest('images/svg-sprite/'));
});

gulp.task('fileinclude', function() {
  gulp.src(['index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: ''
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
  gulp.watch('./scss/*.scss', ['sass']);
  gulp.watch('./js/*.js', ['dist-sw']);
  gulp.watch('./images/svg/*.svg', ['svgstore', 'fileinclude']);
  gulp.watch('./index.html', ['fileinclude', browserSync.reload]);

  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
});
