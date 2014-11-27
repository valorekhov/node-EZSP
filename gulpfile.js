var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsd = require('gulp-tsd');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: true,
    sortOutput: true,
    module: "commonjs"
});

//uncomment to turn on browserifyshim diags
//process.env.BROWSERIFYSHIM_DIAGNOSTICS=1;

gulp.task('ts-compile', ['ts-typings'], function () {
    var tsResult = gulp.src(['src/*.ts', 'typings/**/*.ts'])
                       .pipe(sourcemaps.init())
                       .pipe(ts(tsProject));
    return tsResult.js.pipe(gulp.dest('build'));
})

gulp.task('ts-typings', function (cb) {
    tsd({
        command: 'reinstall',
        config: './tsd.json'
    },cb);
});

gulp.task('clean', function(cb) {
    del(['build', 'typings'], cb);
});

gulp.task('default', function() {
    gulp.start('ts-compile', 'ts-typings');
});

gulp.task('watch', ['ts-compile'], function() {
    gulp.watch('src/*.ts', ['ts-compile']);
});
