var gulp = require('gulp-param')(require('gulp'), process.argv),
    plugins = require('gulp-load-plugins')();

gulp.task('build', function(minify){
    gulp.src('src/*.js')
        .pipe(plugins.concat('angular-dictate' + (minify ? '.min': '') + '.js'))
        .pipe(plugins.if(!minify, plugins.stripComments()))
        .pipe(plugins.if(!!minify, plugins.uglify()))
        .pipe(plugins.header([
            '/**',
            ' * <%= pkg.name %>',
            ' * @version v<%= pkg.version %> (' + (new Date()).toISOString().slice(0, 10) + ')',
            ' * @link <%= pkg.homepage %>',
            ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)',
            ' * @license <%= pkg.license %>',
            ' */',
            ''
        ].join('\n'), { pkg : require('./package.json') } ))
        .pipe(gulp.dest('dist'));
});

gulp.task('doc', function(){
    gulp.src('src/*.js')
        .pipe(plugins.markdox())
        .pipe(plugins.concat('current.md'))
        .pipe(gulp.dest('doc'));
});

gulp.task('test', function(spec, watch) {
    gulp.src([
        'bower_components/moment/moment.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-local-storage/dist/angular-local-storage.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'src/*.js',
        'test/app.js',
        'test/' + ((spec) ? spec : '*') + 'Spec.js'
    ])
        .pipe(plugins.karma({
            configFile: 'karma.conf.js',
            action: watch ? 'watch' : 'run'
        }));
});
