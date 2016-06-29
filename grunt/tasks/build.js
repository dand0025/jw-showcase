module.exports = function (grunt) {

    grunt.registerTask('build', [
        'karma:unit',
        'clean:dist',
        'ngtemplates',
        'useminPrepare',
        'compass:dist',
        'concat',
        'copy:dist',
        'cssmin',
        'uglify',
        'usemin',
        'htmlmin',
        'template:dist'
    ]);
};