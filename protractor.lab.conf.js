exports.config = {

    baseUrl: 'http://192.168.1.192:9001',

    cucumberOpts: {
        require: [
            'test/features/support/**/*.js',
            'test/features/step_definitions/**/*.js'
        ]
    },

    framework: 'custom',

    frameworkPath: require.resolve('protractor-cucumber-framework'),

    maxSessions: 1,

    multiCapabilities: [

        // {
        //     'browserName':     'Safari',
        //     'deviceName':      'iPhone 5',
        //     'platformVersion': '8.2',
        //     'platformName':    'IOS'
        // },
        // {
        //     'browserName':     'Safari',
        //     'deviceName':      'iPhone 5',
        //     'platformVersion': '8.1.2',
        //     'platformName':    'IOS'
        // },
        // {
        //     'browserName':     'Safari',
        //     'deviceName':      'iPhone 5',
        //     'platformVersion': '9.1',
        //     'platformName':    'IOS'
        // },
        // {
        //     'browserName':     'Safari',
        //     'deviceName':      'iPhone 5S',
        //     'platformVersion': '8.0',
        //     'platformName':    'IOS'
        // },
        // {
        //     'browserName':     'Safari',
        //     'deviceName':      'iPhone 6',
        //     'platformVersion': '9.2',
        //     'platformName':    'IOS'
        // },
        {
            'platformName':    'ANDROID',
            'platformVersion': '5.0',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy Tab S2'
        },
        {
            'platformName':    'ANDROID',
            'platformVersion': '4.1.2',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy S2'
        },
        {
            'platformName':    'ANDROID',
            'platformVersion': '4.4.2',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy S3'
        },
        {
            'platformName':    'ANDROID',
            'platformVersion': '5.1.1',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy Core'
        },
        {
            'platformName':    'ANDROID',
            'platformVersion': '5.0',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy S5'
        },
        {
            'platformName':    'ANDROID',
            'platformVersion': '5.1.1',
            'browserName':     'Chrome',
            'deviceName':      'Samsung Galaxy S6 Edge'
        }
    ],

    seleniumAddress: 'http://192.168.1.163:4444/wd/hub',

    specs: [
        'test/features/*.feature'
    ]
};

exports.config.multiCapabilities = exports.config.multiCapabilities.map(function (capabilities) {

    capabilities.cucumberOpts = {
        format: 'json:./test/reports/e2e.' + capabilities.browserName + '.json',
        tags:   '@mobile'
    };

    if (/iPad/.test(capabilities.deviceName)) {
        capabilities.cucumberOpts.tags = '@tablet';
    }

    return capabilities;

});