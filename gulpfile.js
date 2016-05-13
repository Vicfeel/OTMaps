/**
 * ugilfy the js files
 */

var gulp = require('gulp'),
    uglify = require('gulp-uglify')

gulp.task('uglify', function () {
    gulp.src('./src/**/*.js')
        .pipe(uglify())    //Ñ¹Ëõ
        .pipe(gulp.dest('./dist/'));  //Êä³ö
});

gulp.task('default', ['uglify']);
