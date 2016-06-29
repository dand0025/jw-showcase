module.exports = function (grunt) {

    grunt.registerTask('test:unit', [
        'karma:unit'
    ]);

    grunt.registerTask('test:unit:watch', [
        'karma:watch'
    ]);

    grunt.registerTask('test:protractor:local', [
        'clean:server',
        'clean:reports',
        'compass',
        'ngtemplates:server',
        'template:server',
        'connect:test',
        'protractor:dev'
    ]);

    grunt.registerTask('test:protractor:browserstack', [
        'clean:server',
        'clean:reports',
        'compass',
        'ngtemplates:server',
        'template:server',
        'connect:test',
        'protractor:browserstack'
    ]);
};