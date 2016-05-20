##项目背景
在折腾ES6，突然想起大学时用c语言写过俄罗斯方块，现在主要是使用ES6的Class特性。同一时间，我在看约翰.霍兰的《涌现》和KK的《失控》，产生了对人工智能的莫大兴趣，终极目标是想写一个自动玩俄罗斯方块的小机器人。
##设计思路
- 全面应用面向对象的设计思想，让功能内聚性强。
- 把七种方块想成独立的“生物”对象，让它能“看”到周围的世界。
- 没有使用传统的大的二维数组来表示游戏场面状态，而是让tetris自己去“看”。

##运行方法
项目采用node.js+electron进行桌面开发，因此请先安装相关系统：
```
npm install electron-prebuilt -g
```
请下载源代码：
```
git clone https://git.oschina.net/zhoutk/Tetris.git
```
进入项目目录：
```
cd Tetris
```
运行程序：
```
electron .
```
##交流博客
我会把心得体会写在我的博客中，地址如下：
```
https://segmentfault.com/blog/zhoutk
```