/**
 *  grunt dependency
 */
var grunt = require('grunt');

/**
 * configuration
 */
module.exports ={
    /**
     * configuration for sketch task
     * sketchtool must be installed for this task to work properly
     * http://bohemiancoding.com/sketch/tool/
     */
    sketch_export:{
        design:{
            options: {
                type: 'slices',
                overwrite: true
            },
            src: 'assets/design.sketch',
            dest: 'assets/img-sketch/'
        }
    },

    /**
     * image minification configuration
     * this task should be called through 'newer' in order to only update changed assets
     */
    imagemin:{
        all:{
            options:{
                optimizationLevel: 7
            },
            files:[
                {
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'webroot/assets/img/'
                },
                {
                    expand: true,
                    cwd: 'assets/img-sketch/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'webroot/assets/img/'
                }
            ]
        }
    },

    /**
     * webfont creation configuration
     * this task finds all icon-*.svg files in the image directory and converts
     * them to a webfont using fontforge, and creates a demo html file for previews
     */
    webfont:{
        icons: {
            src: [
                'assets/icons/*.svg',
                'assets/icons-sketch/*.svg'
            ],
            dest: 'webroot/assets/fonts/',
            destCss: 'assets/less/',
            options: {
                stylesheet: 'less',
                font: 'icon-font',
                hashes: false,
                syntax: 'bootstrap',
                relativeFontPath: '../fonts/',
                htmlDemo: true,
                destHtml: 'webroot/assets/fonts/',
                engine: 'fontforge'
            }
        }
    },

    /**
     * watch configuration
     */
    watch:{
        sketch:{
            files: ['assets/design.sketch'],
            tasks: ['sketch-export'],
            options: {
                nospawn: false
            }
        },
        images:{
            files: [
                'assets/img/**/*.{png,jpg,gif,svg}',
                'assets/img-sketch/**/*.{png,jpg,gif,svg}',
                '!assets/img-sketch/**/icon-*.svg'
            ],
            tasks: ['build-images'],
            options: {
                nospawn: false
            }
        },
        icons:{
            files: [
                'assets/icons/*.svg',
                'assets/icons-sketch/*.svg'
            ],
            tasks: ['build-icon-font'],
            options: {
                nospawn: true
            }
        }
    },

    copy:{
        'sketch-icons': {
            files: grunt.file.expandMapping(['assets/img-sketch/**/icon-*.svg'], '', {
                rename: function( destBase, destPath ) {
                    return destBase+destPath.replace('icon-', '').replace('/img-sketch/', '/icons-sketch/');
                }
            } )
        }
    },

    /**
     * removes generated css and image files
     * source images exported from sketch are not removed, but optimized version are.
     */
    clean:{
        //only remove images that have an original in assets/img
        img: grunt.file.expandMapping(['assets/img/**/*.{png,jpg,gif}'], '', {
            rename: function( destBase, destPath ) {
                return destBase+destPath.replace('assets/img/', 'webroot/assets/img/');
            }
        } ).map( function( item ){ return item.dest; }),

        'tmp-icon-svgs': [
            'assets/img-sketch/icon-*.svg'
        ],

        'sketch': [
            'assets/icons-sketch/**/*.svg',
            'assets/img-sketch/**/*'
        ],

        icons: [
            'assets/less/icon-font.less',
            'webroot/assets/fonts/icon-font.*'
        ]
    },


    /**
     * utility to add notifications on task complete
     */
    notify:{
        sketch: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Sketch slices exported.'
            }
        },
        images: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Images optimized.'
            }
        },
        'icon-font': {
            options: {
                title: 'Grunt Task Complete',
                message: 'Icon font generated.'
            }
        }

    }


};
