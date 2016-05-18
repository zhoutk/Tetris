"use strict";

var Block = require('./tetrisBlock')

var canvas = document.getElementById('tetris'),  //获取canvas元素
    ct = canvas.getContext('2d');  //获取画图环境，指明为2d

(function (){
    let b1 = new Block(ct)
    b1.draw(1,1)
    b1.draw(100,1)
}());

