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
    constructor(shape,ct){
        this.data = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.shape = shape || 0;
        this.x =  3;
        this.y =  0;
        if(ct){
            this.x = 0;
        }else{
            ct = ctx;
        }
        this.block = new Block(ct, COLORS[shape]);

        for(let i = 0; i < SHAPES[this.shape].length; i++){
            if(SHAPES[this.shape][i]){
                this.data[i % 4][1 + Math.floor(i/4)] = 1;
            }
        }
    }
    moveDown(){
        let h = this.y;
        while(true){
            let flag = true;
            for(let i = 0; i < 4; i++){
                for(let j = 0; j < 4; j++){
                    if(this.data[i][j] && (j ==3 || this.data[i][j+1] == 0)){
                        if(!this.canSee(this.x + i, this.y + 1 + j)){
                            flag = false;
                            break;
                        }
                    }
                }
                if(!flag){
                    break;
                }
            }
            if(flag){
                this.erase();
                this.y++;
                this.draw();
            }else{
                break;
            }
        }
    }
    moveRight(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j] && (i ==3 || this.data[i+1][j] == 0)){
                    if(!this.canSee(this.x +1 + i, this.y + j)){
                        return false;
                    }
                }
            }
        }
        this.erase();
        this.x++;
        this.draw();
        return true;
    }
    moveLeft(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j] && (i ==0 || this.data[i-1][j] == 0)){
                    if(!this.canSee(this.x -1 + i, this.y + j)){
                        return false;
                    }
                }
            }
        }
        this.erase();
        this.x--;
        this.draw();
        return true;
    }
    rotate(){
        let b = [[],[],[],[]];
        for(let i=0;i<4;i++){  
            for(let j=0;j<4;j++){  
                b[i][j] = this.data[j][3-i];  
            }  
        }  
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j] == 0 && b[i][j] == 1){
                    if(!this.canSee(this.x  + i, this.y + j)){
                        return false;
                    }
                }
            }
        }
        this.erase();
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                this.data[i][j] = b[i][j];  
            }
        }
        this.draw();
    }
    canDraw(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j]){
                    if(!this.canSee(this.x + i, this.y + j)){
                        return false;
                    }
                }
            }
        }
        return true;
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
