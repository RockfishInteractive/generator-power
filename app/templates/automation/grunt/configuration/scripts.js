/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

var settings = require( '../settings' );
var path = require( 'path' );

//determine which files to watch and clean based on settings
var watchFiles = [ '<%= settings.source.scripts %>/**/*.js' ];
var cleanFiles = [ '<%= settings.build.scripts %>/**/*.js' ];

function expand( src, dest, map ){
    var obj = {};
    for ( var target in map ){
        var parts = map[ target ];
        var d = path.join(dest, target);
        obj[ d ] = [];
        parts.forEach( function( part ){
           obj[ d].push( path.join( dest, part ) );
        });
    }

    return obj;
}

//create function to check if obj is array and has values
function hasFilesTest( obj ){
    return function(){
        if ( Array.isArray( obj ) ){
            if ( obj.length > 0 ){
                return true;
            }
        }
        return false;
    };
}


/**
 * configuration
 */
module.exports = {

    /**
     * jshint configuration
     */
    jshint: {
        all: [
            //'gruntfile.js',
            '<%= settings.source.scripts %>/**/*.js',
            //'automation/grunt/**/*.js',
            '!**/vendor/**/*.js' //don't jshint vendor scripts
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    /**
     * uglify
     */
    uglify: {
        options: {
            compress: settings.scripts.compress,
            preserveComments: settings.scripts.compress ? settings.scripts.comments : 'all'
        },
        copy:{
            files: [{
                expand: true,
                cwd: '<%= settings.source.scripts %>',
                src: settings.scripts.copy,
                dest: '<%= settings.build.scripts %>'
            }]
        },
        concat: {
            files: expand(
                settings.build.scripts,
                settings.source.scripts,
                settings.scripts.concat
            )
        }
    },

    /**
     * string-replace
     */
    'string-replace': {
        console_log: {
          files: [{
              expand: true,
              cwd: '<%= settings.build.scripts %>',
              src: './**/*.js',
              dest: './'
          }],
          options: {
              replacements: [{
                  pattern: /console.log(.*);/g,
                  replacement: ""
              }]
          }
      }
    },

    /**
     * require optimization configuration
     */
    requirejs: {
        options: {
            baseUrl: '<%= settings.source.scripts %>',
            mainConfigFile: '<%= settings.source.scripts %>/<%= settings.scripts.require.config %>',
            optimize: settings.scripts.compress ? 'none' : 'uglify2'
        },

        almond: {
            options:{
                name: "almond",
                include: "<%= settings.scripts.almond.main %>",
                out: "<%= settings.build.scripts %>/<%= settings.scripts.require.out %>"
            }
        },

        modules: {
            options: {
                modules: settings.scripts.require ? settings.scripts.require.modules: []
            }
        }
    },

    /**
     * clean configuration
     */
    clean: {
        scripts: cleanFiles
    },


    /**
     * conditionally run
     */
    if: {
        'jshint': {
            options:{
                config: {
                    property: "settings.scripts.jshint",
                    value: false
                }
            },
            ifTrue: [

            ],
            ifFalse:[
                'jshint'
            ]
        },
        'scripts-copy': {
            options:{
                test: hasFilesTest( settings.scripts.copy )
            },
            ifTrue: [
                'uglify:copy'
            ],
            ifFalse:[

            ]
        },
        'scripts-concat': {
            options:{
                test: hasFilesTest( settings.scripts.concat )
            },
            ifTrue: [
                'uglify:concat'
            ],
            ifFalse:[

            ]
        },
        'scripts-log':{
            options:{
                config: {
                    property: "settings.scripts.log",
                    value: true
                }
            },
            ifTrue: [],
            ifFalse:[
                'string-replace:console_log'
            ]
        },
        'scripts-almond': {
            options:{
                config: {
                    property: "settings.scripts.require.almond",
                    value: undefined
                }
            },
            ifTrue: [],
            ifFalse:[
                'requirejs:almond'
            ]
        },
        'scripts-require': {
            options:{
                config: {
                    property: "settings.scripts.require.modules",
                    value: undefined
                }
            },
            ifTrue: [],
            ifFalse:[
                'requirejs:modules'
            ]
        }
    },


    /**
     * watch task configuration
     */
    watch: {

        /**
         * when scripts are updated, build-scripts
         */
        scripts: {
            files: watchFiles,
            tasks: [ 'build-scripts' ],
            options: {
                spawn: false,
                reload: true
            }
        }

    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        scripts: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Scripts optimized.'
            }
        }
    }


};
