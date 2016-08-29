[![NPM](https://nodei.co/npm/postcss-jingoal.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/postcss-jingoal/)

## 设计思路
1. 使用此插件需要遵循的约定  一倍图，二倍图的存放相对路径暂时要固定，任意定制正在设计开发
路径演示

...父级路径
  1x // 一倍图目录
  2x // 二倍图目录
  sprite // 最终的sprite存放目录
2. 此项目用于为需要支持retina平台，自动生成css sprite，如果你只是想提取css里面的图片然后自动生成 css
 sprite, 而不需要支持二倍图，请移步这里 [spritesmith](https://github.com/Ensighten/spritesmith)

## install
* 安装图片处理工具库 [graphicsmagick](http://sourceforge.mirrorservice.org/g/gr/graphicsmagick/graphicsmagick-binaries/1.3.24/GraphicsMagick-1.3.24-Q8-win64-dll.exe)
安装后，记得添加 gm 的path路径

* npm install grunt-jingoal-thumbnail
二倍图转一倍图工具

具体配置请参考example里面的例子
