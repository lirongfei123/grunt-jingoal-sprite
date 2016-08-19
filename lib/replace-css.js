var fs = require('fs');
var os = require('os');
var path = require('upath');
var async = require('async');
var postcss = require('postcss');

module.exports = function(self, grunt) {
    var done = self.async();
    var options = self.options({
        spriteDir: '../dist/imgs/sprite'
    });
    grunt.log.writeln('开始替换css中的图片');
    var series = [];
    // Iterate over all specified file groups.
    self.files[0].src.forEach(function(f) {
        var cssFilePath = path.normalize(process.cwd() + "/" + f);
        var cssText = grunt.file.read(cssFilePath);
        series.push(function(callback) {
            postcss([require('postcss-jingoal-sprite')({
                mapJsonPath: path.normalize(process.cwd() + "/" + options.spriteDir + "/map.json")
            })]).process(cssText, { from: cssFilePath, to: cssFilePath }).then(function(result) {
                grunt.file.write(cssFilePath, result.css);
                callback();
            });
        });
    });
    async.parallelLimit(series, os.cpus().length, done);
}
