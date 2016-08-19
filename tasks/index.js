/*
 * grunt-jingoal-sprite
 * https://github.com/yangsendyx/react-redux-router
 *
 * Copyright (c) 2016 lirongfei123
 * Licensed under the MIT license.
 */

'use strict';
var createSprite = require('../lib/create-sprite');
var replaceCss = require('../lib/replace-css');
module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('jingoal_sprite', 'The best Grunt plugin ever.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        // 创建图片map
        // 替换css
        if (this.target == 'createSprite') {
            createSprite(this, grunt);
        }
        if (this.target == 'replaceCss') {
            replaceCss(this, grunt);
        }
    });
};