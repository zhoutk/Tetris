"use strict";

var Block = require('./block')
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
const SOUNDS = {
    collision : document.getElementById("audio_collision"),
    down : document.getElementById("audio_move"),
    rotate : document.getElementById("audio_pop"),
    gameover : document.getElementById("audio_gameover"),
    score : document.getElementById("audio_score")
}

class Tetris {
    constructor(shape,ctx,x,y,color,stroke){
        this.data = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        this.shape = shape || 0;
        this.ctx = ctx;
        this.color = color || COLORS[shape]
        this.x =  x || 0;
        this.y =  y || 0;
        this.stroke = stroke || 'white'
        this.block = new Block(ctx, this.color, this.stroke);

        for(let i = 0; i < SHAPES[this.shape].length; i++){
            if(SHAPES[this.shape][i]){
                this.data[i % 4][1 + Math.floor(i/4)] = 1;
            }
        }
    }
    cleanCount(){
        let h = 19, levelCount = 0;
        while(h >= 0){
            let count = 0;
            for(let i = 0; i< 10; i++){
                if(this.canSee(i,h)){
                    count++;
                }
            } 
            if(count == 0){
                levelCount++;
            }else if(count == 10){
                break;
            }
            h--;
        }
        return levelCount;
    }
    cleanup(){
        let h = 19, levelCount = 0;
        while(h >= 0){
            let count = 0;
            for(let i = 0; i< 10; i++){
                if(this.canSee(i,h)){
                    count++;
                }
            } 
            if(count == 0){
                let level = h;
                levelCount++;
                SOUNDS['score'].play();
                while(level >= 0){
                    let ct = 0;
                    for(let j = 0; j < 10; j++){
                        this.block.erase(j,level);
                        if(this.canSee(j,level-1)){
                            ct++;
                        }else{
                            let bk = new Block(this.ctx,this.block.getColor(j,level-1)) 
                            bk.draw(j,level)
                        }
                    }
                    if(ct == 10){
                        break;
                    }else{
                        level--;
                    }
                }
            }else if(count == 10){
                break;
            }else{
                h--;
            }
        }
        return levelCount;
    }
    moveUp(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j] && (this.data[i][j - 1] == 0)){
                    if(!this.canSee(this.x + i, this.y + j - 1)){
                        return false;
                    }
                }
            }
        }
        this.erase();
        this.y--;
        this.draw();
        return true;
    }
    moveNext(){
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
            return true;
        }else{
            let level = this.cleanup();
            if(level > 0){
                levels += level;
                scores += LVSCS[level]
                document.getElementById('levelShow').value = levels;
                document.getElementById('scoreShow').value = scores;
                if(!isAutoPlay && Math.floor(scores / STEPVAL) != STEP){
                    clearInterval(interval)
                    interval = setInterval( tick, TICKVAL - ++STEP * STEPVAL );
                    document.getElementById('speedShow').value = STEP + 1;
                }
            }else{
                SOUNDS['down'].play()
            }
            return false;
        }
    }
    moveDown(){
        let yMax = 19;
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j] && (j ==3 || this.data[i][j+1] == 0)){
                    let k = 0;
                    while(this.canSee(this.x + i, this.y + ++k + j));
                    if(k - 1 < yMax)
                        yMax = k - 1;
                }
            }
        }
        this.erase();
        this.y += yMax;
        this.draw();
        let level = this.cleanup();
        if(level > 0){
            levels += level;
            scores += LVSCS[level]
            document.getElementById('levelShow').value = levels;
            document.getElementById('scoreShow').value = scores;
            if(!isAutoPlay && Math.floor(scores / STEPVAL) != STEP){
                clearInterval(interval)
                interval = setInterval( tick, TICKVAL - ++STEP * STEPVAL );
                document.getElementById('speedShow').value = STEP + 1;
            }
        }else{
            SOUNDS['down'].play()
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
        SOUNDS['rotate'].play();
        this.draw();
    }
    canDrawNext(){
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(this.data[i][j]){
                    if(!this.canSee(this.x + i, this.y + j)){
                        SOUNDS['gameover'].play();
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
        if(x < 0 || x > 9 || y > 19)
            return false;
        return this.block.canSee(x,y) == 0;
    }
}

module.exports = Tetris;
