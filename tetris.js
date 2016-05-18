"use strict";

var Block = require('./block')
var canvas = document.getElementById('tetris'),  //获取canvas元素
    ctx = canvas.getContext('2d');  //获取画图环境，指明为2d
const SHAPES = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 0, 1, 1, 0,
      0, 1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
const COLORS = [
    'brown', 'olive', 'blue', 'chocolate', 'gray', 'green', 'purple'
];

class Tetris {
    constructor(shape){
        this.shape = shape;
        this.x = 3;
        this.y = 1;
        this.block = new Block(ctx, COLORS[shape]);
    }
    draw(){
        for(let i = 0; i < SHAPES[this.shape].length; i++){
            if(SHAPES[this.shape][i]){
                this.block.draw(this.x * 30 + (i % 4) * 30, this.y * 30 + (Math.floor(i/4)) * 30)
            }
        }
    }
}

module.exports = Tetris;
