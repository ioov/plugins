/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-04-27 10:41:57
 * @version $Id$
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('minify', function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dest/js'));
});

gulp.task('default', ['minify']);