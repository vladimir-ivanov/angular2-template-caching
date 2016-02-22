var webpackConfig = require('./webpack.config.js');
webpackConfig.failOnError = true;

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        inline_angular_templates: {
            dist: {
                options: {
                    base: '.',
                    prefix: './',            // (Optional) Prefix path to the ID. Default is empty string.
                    unescape: {             // (Optional) List of escaped characters to unescape
                        '&lt;': '<',
                        '&gt;': '>',
                        '&apos;': '\'',
                        '&amp;': '&'
                    }
                },
                files: {
                    'index.html': ['./src/**/*.html']
                }
            }
        },
        webpack: {
            default: webpackConfig
        }
    });

    grunt.loadNpmTasks('grunt-inline-angular-templates');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.registerTask('build', [
     //   'webpack',
        'inline_angular_templates'
    ]);
    grunt.registerTask('default', ['build']);
};