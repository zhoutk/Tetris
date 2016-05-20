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
        this.data = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.shape = shape;
        this.x = 0;
        this.y = 0;
        this.block = new Block(ctx, COLORS[shape]);

        for(let i = 0; i < SHAPES[this.shape].length; i++){
            if(SHAPES[this.shape][i]){
                this.data[i % 4][1 + Math.floor(i/4)] = 1;
            }
        }
    }
    draw(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j]){
                    this.block.draw(this.x + i, this.y + j)
                }
            }
        }
    }
    rotate(){  
        for(let layer = 0; layer < 4; layer++){  
            let first = layer;                
            let last = 4-1-layer;                 
            for(let i = layer; i < last; i++){  
                let offset = i-layer;  
                let top = this.data[first][i];  
                this.data[first][i] = this.data[last-offset][first];  
                this.data[last-offset][first] = this.data[last][last-offset];  
                this.data[last][last-offset] = this.data[i][last];  
                this.data[i][last] = top;  
            }  
        }  
    }  
    erase(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j]){
                    this.block.erase(this.x + i, this.y + j)
                }
            }
        }
    }
    canSee(x,y){
        if(x < 0 || x > 9 || y > 19 || y < 0)
            return false;
        return this.block.canSee(x,y) == 0;
    }
}

module.exports = Tetris;
