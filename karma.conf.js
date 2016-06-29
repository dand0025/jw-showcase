// Karma configuration
// Generated on Fri Jun 24 2016 16:52:45 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({

        basePath: '.',

        frameworks: ['jasmine'],

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/gsap/src/uncompressed/TweenLite.js',
            'bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js',
            'app/scripts/app.js',
            'app/scripts/core/core.module.js',
            'app/scripts/dashboard/dashboard.module.js',
            'app/scripts/video/video.module.js',
            'app/scripts/**/*.js',
            'app/views/**/*.html',
            'test/fixtures/feed.json',
            'test/unit/helpers/*.js',
            'test/unit/**/*Spec.js'
        ],

        exclude: [
            'app/scripts/countdown.js',
            'test/fixtures/invalidConfig.json'
        ],

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/',
            moduleName:  'app.partials'
        },


        jsonFixturesPreprocessor: {
            stripPrefix: 'test/fixtures/'
        },

        preprocessors: {
            '**/*.html':               ['ng-html2js'],
            'test/fixtures/**/*.json': ['json_fixtures']
        },

        reporters: ['dots'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['PhantomJS'],

        singleRun: true,

        concurrency: Infinity
    });
};
