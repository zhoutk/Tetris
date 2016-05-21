"use strict";

var Tetris = require('./tetris')
var canvasTeteris = document.getElementById('tetris'),  //获取canvas元素
    ctx = canvasTeteris.getContext('2d');  //获取画图环境，指明为2d
var canvasPreview = document.getElementById('block'),  
    blockCtx = canvasPreview.getContext('2d');  
var randNum, nextNum, tetris, tetrisNext;

const LVSCS = [0,1,3,6,10]
var gameState = false, levels = 0, scores = 0;
var interval, TICKVAL = 450, STEPVAL = 50, STEP = 0;

function gameStart(){
    ctx.clearRect(0,0,300,600)
    blockCtx.clearRect(0,0,120,120)
    document.getElementById('levelShow').value = levels;
    document.getElementById('scoreShow').value = scores;
    document.getElementById('speedShow').value = STEP + 1;
    randNum = Math.floor(Math.random()*7)
    nextNum = Math.floor(Math.random()*7)
    tetris = new Tetris(randNum,ctx,3,-1)
    tetrisNext = new Tetris(nextNum,blockCtx)
    gameState = true;
    tetris.draw();
    tetrisNext.draw()
    clearInterval(interval)
    interval = setInterval( tick, TICKVAL );
}

function generateNext(){
    randNum = nextNum; 
    nextNum = Math.floor(Math.random()*7)
    tetris = new Tetris(randNum,ctx,3,-1)
    if(tetris.canDrawNext()){
        tetris.draw();
        tetrisNext.erase();
        tetrisNext = new Tetris(nextNum,blockCtx)
        tetrisNext.draw()
    }else{
        levels = 0;
        scores = 0;
        STEP = 0;
        tetris.draw();
        gameState = false;
        clearInterval(interval)
        document.getElementById('playControl').style.backgroundColor = 'green';
        document.getElementById('playControl').onclick = playButtonClick;
        document.getElementById('playControl').onmouseout = cursorMoveOutplayButton;
        document.getElementById('playControl').onmouseover = cursorOverPlayButton;

        ctx.save()
        ctx.fillStyle = "yellow";
        ctx.font = "bold 30px sans-serif";
        ctx.fillText("游戏结束！",80,260);
        ctx.restore();
    }
}

function tick(){
    if(!tetris.moveNext()){
        generateNext();
    }
}

function keyProess(e){
    if(gameState){
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
                    generateNext();
                }
            break;  
        }  
    }
}

document.body.onkeydown = function(e){
    keyProess(e);
}

function cursorMoveOutplayButton(){
    document.getElementById('playControl').style.backgroundColor = 'green'
}

function cursorOverPlayButton(){
    document.getElementById('playControl').style.backgroundColor = 'red'
}

function playButtonClick(){
    document.getElementById('playControl').onclick = false;
    document.getElementById('playControl').onmouseout = false;
    document.getElementById('playControl').onmouseover = false;
    document.getElementById('playControl').style.backgroundColor = 'gray'
    gameStart();
}

document.getElementById('playControl').onmouseout = cursorMoveOutplayButton;
document.getElementById('playControl').onmouseover = cursorOverPlayButton;
document.getElementById('playControl').onclick = playButtonClick;

// document.body.onload = gameStart();
