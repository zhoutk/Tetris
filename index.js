"use strict";

var Tetris = require('./tetris')
var canvas = document.getElementById('block'),  //获取canvas元素
    blockCtx = canvas.getContext('2d');  //获取画图环境，指明为2d
var randNum = Math.floor(Math.random()*7)
var nextNum = Math.floor(Math.random()*7)
var tetris = new Tetris(randNum)
var tetrisNext = new Tetris(nextNum,blockCtx)

function gameStart(){
    tetris.draw();
    tetrisNext.draw()
}

function keyProess(e){
    // e = e || window.event;  
    switch(e.keyCode){  
        case 37:  //left key up
            tetris.moveLeft();
            break;  
        case 38:  //up key up
            tetris.rotate()
            break;  
        case 39:  //right key up
            tetris.moveRight();
            break;  
        case 40:  //down key up
        case 32:  //space key up
            tetris.moveDown();
            randNum = nextNum; 
            nextNum = Math.floor(Math.random()*7)
            tetris = new Tetris(randNum)
            if(tetris.canDraw()){
                tetris.draw();
                tetrisNext.erase();
                tetrisNext = new Tetris(nextNum,blockCtx)
                tetrisNext.draw()
            }else{
                alert("game is over.")
            }
            break;  
    }  
}

document.body.onkeyup = function(e){
    keyProess(e);
}

document.body.onload = gameStart();
