var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');


gulp.task('css', function () {
  gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.init())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('compress', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('js/min'));
});

gulp.task('concat', function() {
  return gulp.src([
      // Specifying each one so it happens in order
      'js/min/jquery.js',
      'js/min/global.js'
    ])
    .pipe(concat('global.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('move', function() {
  return gulp.src([
      'js/min/service-worker.js'
    ])
    .pipe(gulp.dest('dist'));
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
  gulp.watch('./scss/*.scss', ['css']);
  gulp.watch('./js/*.js', ['compress', 'concat', 'move']);
  gulp.watch('./images/svg/*.svg', ['svgstore', 'fileinclude']);
  gulp.watch('./index.html', ['fileinclude', browserSync.reload]);

  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
});
