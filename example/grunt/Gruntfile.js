module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                sourceMap: false,
                compressed: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '../static/css/',
                    src: ['**/*.scss'],
                    dest: '../dist/css/',
                    ext: '.css'
                }]
            }
        },
        jingoal_thumbnail: {
            styles: {
                options: {
                    cleancss: false
                },
                files: [{
                    expand: true,
                    cwd: '../dist/imgs/2x/',
                    src: ['**/*.png'],
                    dest: '../dist/imgs/1x/',
                    ext: '.png'
                }]
            }
        },

        jingoal_sprite: {
            options: {
                spriteDir: "../dist/imgs/sprite"
            },
            createSprite: {
                src: '../dist/imgs/2x/*.png'
            },
            replaceCss: {
                src: '../dist/css/*.css'
            }
        }
    });
    grunt.registerTask('default', ['sass', 'jingoal_thumbnail', 'jingoal_sprite']);
};
