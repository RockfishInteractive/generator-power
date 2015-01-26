/***********************************************************************
 * Default Grunt Scaffolding
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/

var GruntStartup = require('grunt-startup');

module.exports = new GruntStartup( {

    loadTasks: true,

    ignoreTasks: [
        'grunt-sketch'
    ],
    taskPaths: [
        'automation/grunt/tasks/',
        'automation/grunt/tasks/utility/'
    ],
    configPaths: [
        './default-settings.json',
        './local-settings.json',
        'automation/grunt/configuration/']
} );
