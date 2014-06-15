/**
 * configuration
 */
module.exports = {

    /**
     * less compilation configuration
     * compiles less to css
     */
    less: {
        main: {
            options: {
                paths: [
                    'less'
                ],
                yuicompress: false,
                strictImports: true
            },
            files: {
                'webroot/assets/css/main.css' :'assets/less/main.less'
            }
        }
    },

    /**
     * prefixer configuration
     * automatically adds prefixes based on the specified browsers
     * additional information can be found at: https://github.com/ai/autoprefixer#browsers
     */
    autoprefixer: {
        options: {
            browsers: ['ie > 7', 'Firefox > 3.5', 'chrome > 9', 'safari > 5']
        },
        main: {
            src: 'webroot/assets/css/main.css'
        }
    },

    /**
     * configuration for the combine-media-queries task
     * media queries are combined and placed at the bottom of the css file
     * using a mobile first sorting methodology
     */
    cmq: {
        options: {
            log: false
        },
        main: {
            files: {
                'webroot/assets/css': [
                    'webroot/assets/css/main.css'
                ]
            }
        }
    },

    /**
     * configuration for css optimizer
     * css optimizer combines identical selectors, removes unnecessary values and minifys css
     */
    csso: {
        main: {
            files: {
                'webroot/assets/css/main.min.css': [
                    'webroot/assets/css/main.css'
                ]
            }
        }
    },

    /**
     * watch configuration for less
     */
    watch:{
        less:{
            files: ['assets/less/**/*.less'],
            tasks: ['build-css'],
            options: {
                nospawn: true
            }
        }
    },


    /**
     * removes generated files
     */
    clean: {
        css: [
            'webroot/assets/css/main.css',
            'webroot/assets/css/main.min.css'
        ]
    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        css: {
            options: {
                title: 'Grunt Task Complete',
                message: 'CSS compiled and optimized'
            }
        }
    }

};