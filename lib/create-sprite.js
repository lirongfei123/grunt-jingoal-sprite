// Load in our dependencies 
var Pixelsmith = require('pixelsmith');
var concat = require('concat-stream');
var fs = require('fs');
var os = require('os');
var gm = require('gm');
var path = require('upath');
var async = require('async');
var pixelsmith = new Pixelsmith();
module.exports = function(self, grunt) {
    var done = self.async();
    var options = self.options({
        spriteDir: '../dist/imgs/sprite'
    });
    var imgSeries = [],
        spriteSeries = [];
    // Iterate over all specified file groups.
    self.files[0].src.forEach(function(f) {
        imgSeries.push(function(callback) {
            fileManger.createFile(path.normalize(process.cwd() + "/" + f), function() {
                callback();
            });
        });

        //   // Concat specified files.
        //   var src = f.src.filter(function(filepath) {
        //     // Warn on and remove invalid source files (if nonull was set).
        //     if (!grunt.file.exists(filepath)) {
        //       grunt.log.warn('Source file "' + filepath + '" not found.');
        //       return false;
        //     } else {
        //       return true;
        //     }
        //   }).map(function(filepath) {
        //     // Read file source.
        //     return grunt.file.read(filepath);
        //   }).join(grunt.util.normalizelf(options.separator));

        //   // Handle options.
        //   src += options.punctuation;

        //   // Write the destination file.
        //   //grunt.file.write(f.dest, src);

        //   // Print a success message.
        //   grunt.log.writeln('File "' + f.dest + '" created.');
    });
    async.parallelLimit(imgSeries, os.cpus().length, function() {
        spriteSeries.push(function(callback) {
            createSprite(options, function() {
                grunt.log.writeln('file Map 生成成功');
                callback();
            })
        });
        async.parallelLimit(spriteSeries, os.cpus().length, done);
    });
}

/*file类*/
function ImgFile(name, width, height, buffer) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.buffer = buffer;
}
/*图片宽度管理器*/
var widthManger = (function() {
    var widthTypes = [];
    return {
        add: function(width) {
            if (widthTypes.filter(function(value) {
                    return value.width == width;
                }).length == 0) {
                var imgX = 0;
                if (widthTypes.length > 0) {
                    var prev = widthTypes[widthTypes.length - 1];
                    imgX = prev.x + prev.width;
                    while (imgX % 2 !== 0) imgX += 1;
                }
                widthTypes.push({
                    width: width,
                    x: imgX
                });
            }
        },
        getX: function(width) {
            var result = 0;
            widthTypes.forEach(function(value) {
                if (value.width == width) {
                    result = value.x;
                }
            });
            return result;
        },
        getTotalWidth: function() {
            var last = widthTypes[widthTypes.length - 1];
            return last.x + last.width;
        }
    }
}());
//图片分类管理器,根据宽度分类
var fileManger = (function() {
    var fileTypes = {},
        maxY = 0;
    return {
        add: function(file) {
            var fileWidth = file.width;
            widthManger.add(fileWidth);
            if (typeof fileTypes[fileWidth] == "undefined") {
                fileTypes[fileWidth] = [];
            }
            var imgY = 0;
            var childsContainer = fileTypes[fileWidth];
            if (childsContainer.length > 0) {
                var last = childsContainer[childsContainer.length - 1];
                imgY = last.y + last.height;
                while (imgY % 2 !== 0) imgY += 1;
                if (imgY + last.height > maxY) {
                    maxY = imgY + last.height;
                }
            }
            file.x = widthManger.getX(fileWidth);
            file.y = imgY;
            fileTypes[fileWidth].push(file);
        },
        getMaxY: function() {
            return maxY;
        },
        createFile: function(filepath, callback) {
            var _this = this;
            pixelsmith.createImages([filepath], function handleImages(err, imgs) {
                if (err) {
                    throw err;
                }
                var img = imgs[0];
                _this.add(new ImgFile(filepath.replace(/\\/g, "/").replace("/2x/", "/1x/"), img.width, img.height, img));
                callback();
            })
        },
        getAllFiles: function() {
            return fileTypes;
        }
    }
}());

function createSprite(options, callback) { //根据map生成sprite
    var fileMap = {};//最终map
    
    var spritePath = path.normalize(process.cwd() + "/" + options.spriteDir);
    if (!fs.existsSync(spritePath)) {
        fs.mkdirSync(spritePath);
    }
    var canvas = pixelsmith.createCanvas(widthManger.getTotalWidth(), fileManger.getMaxY());
    var allFiles = fileManger.getAllFiles();
    for (var i in allFiles) {
        allFiles[i].forEach(function(img, key) {
            canvas.addImage(img.buffer, img.x, img.y);
            var imgName = path.resolve(img.name).replace(/\\/g, "/");
            fileMap[imgName] = {
                width: img.width,
                height: img.height,
                x: img.x / 2,
                y: img.y / 2
            }
        });
    }
    // Export canvas to image 
    var imageStream = canvas['export']({ format: 'png' });
    imageStream.pipe(concat(function handleResult(image) {
        fs.writeFileSync(spritePath + "/2x.png", image);
        gm(spritePath + "/2x.png").size(function(err, value) {
            this.thumb(value.width / 2, value.height / 2, spritePath + "/1x.png", 100, function() {
                fs.writeFileSync(spritePath + "/map.json", new Buffer(JSON.stringify(fileMap, false, 4)));
                callback && callback();
            });
        });
    }));
}
