"use strict";

var Tetris = require('./tetris')
var canvasTeteris = document.getElementById('tetris'),  //获取canvas元素
    ctx = canvasTeteris.getContext('2d');  //获取画图环境，指明为2d
var canvasPreview = document.getElementById('block'),  
    blockCtx = canvasPreview.getContext('2d');  
var randNum = Math.floor(Math.random()*7)
var nextNum = Math.floor(Math.random()*7)
var tetris = new Tetris(randNum,ctx,3)
var tetrisNext = new Tetris(nextNum,blockCtx)

const LVSCS = [0,1,3,6,10]
var gameState = false, levels = 0, scores = 0;

function gameStart(){
    gameStart = true;
    tetris.draw();
    tetrisNext.draw()
}

function keyProess(e){
    if(gameStart){
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
                if(!tetris.moveDown()){
                    randNum = nextNum; 
                    nextNum = Math.floor(Math.random()*7)
                    tetris = new Tetris(randNum,ctx,3)
                    if(tetris.canDrawNext()){
                        tetris.draw();
                        tetrisNext.erase();
                        tetrisNext = new Tetris(nextNum,blockCtx)
                        tetrisNext.draw()
                    }else{
                        levels = 0;
                        scores = 0;
                        tetris.draw();
                        gameStart = false;
                        alert("game is over.")
                    }
            }
            break;  
        }  
    }
}

document.body.onkeydown = function(e){
    keyProess(e);
}

document.body.onload = gameStart();
