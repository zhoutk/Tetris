"use strict";

var Tetris = require('./tetris')
var Tetest = require('./tetest')
var canvasTeteris = document.getElementById('tetris'),  //获取canvas元素
    ctx = canvasTeteris.getContext('2d');  //获取画图环境，指明为2d
var canvasPreview = document.getElementById('block'),  
    blockCtx = canvasPreview.getContext('2d');  
var randNum, nextNum, rTimes = 0, nextRtimes = 0, tetris, tetrisNext;

const LVSCS = [0,1,3,6,10]
var gameState = false, levels = 0, scores = 0;
var interval, TICKVAL = 450, STEPVAL = 50, STEP = 0;
var isAutoPlay = false, isAudioOpen = false;

function tetrisInit(tetris, rTimes){
    for(let i = 0; i < rTimes; i++){
        tetris.rotate();
    }
}

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
    nextRtimes = Math.floor(Math.random()*4);
    rTimes = nextRtimes;
    tetrisInit(tetrisNext,rTimes);
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
        tetrisInit(tetris,rTimes);
        tetrisNext.erase();
        tetrisNext = new Tetris(nextNum,blockCtx)
        nextRtimes = Math.floor(Math.random()*4);
        rTimes = nextRtimes;
        tetrisInit(tetrisNext,rTimes);
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
        document.getElementById('autoPlay').disabled = "disabled";
        document.getElementById('autoPlay').checked = "";
        document.getElementById('audioOpen').disabled = "disabled";
        document.getElementById('audioOpen').checked = "";

        ctx.save()
        ctx.fillStyle = "yellow";
        ctx.font = "bold 30px sans-serif";
        ctx.fillText("游戏结束！",80,260);
        ctx.restore();
    }
}

class Opration{
    constructor(op,num){
        this.op = op;
        this.num = num;
    }
}

class Evaluation{
    constructor(r,x,eva){
        this.x = x;
        this.r = r;
        this.eva = eva;
    }
}

const MOVEOPS = ['moveLeft','moveRight']
var opList = [];

function rightOver(t){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(t.data[i][j] && t.x + i >= 9){
                return false;
            }
        }
    }
    return true;
}

function evaluate(t){
    let ct = t.y ;
    let cct = t.cleanCount();
    if(cct > 1)
        ct += 10 * (cct );
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(t.data[i][j]){
                for(let k=0; k<4; k++){
                    switch(k){
                        case 0: ct += t.canSee(t.x + i + 1, t.y + j) ? 0 : 1;
                        break;
                        case 1: ct += t.canSee(t.x + i - 1, t.y + j) ? 0 : 1;
                        break;
                        case 2: ct += t.canSee(t.x + i, t.y + j + 1) ? 0 : 1;
                        break;
                        case 3: ct += t.canSee(t.x + i, t.y + j - 1) ? 0 : 1;
                        break;
                    }
                }
                if(j ==3 || t.data[i][j+1] == 0){
                    if(t.canSee(t.x +i, t.y + j + 1)){
                        ct -= 5;
                    }else{
                        let k = 2;
                        while(t.y+j+k <= 19){
                            if(t.canSee(t.x +i, t.y + j + k)){
                                ct -= 3;
                                break;
                            }
                            k++;
                        }
                    }
                }
            }
        }
    }
    return ct;
}

function evaluate2(t){
    let ct = t.y * 5, hole = 10;
    // ct += 10 * t.cleanCount();
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(t.data[i][j]){
                if(t.y > 15){
                    hole = 10;
                }else if(t.y > 10){
                    hole = 5;
                }else if(t.y > 5){
                    hole = 2;
                }else{
                    hole = 1;
                }
                let k = 1;
                while(t.canSee(t.x +i, t.y + j + k)){
                    ct -= hole;
                    k++;
                }
                for(let k=0; k<4; k++){
                    switch(k){
                        case 0: ct += t.canSee(t.x + i + 1, t.y + j) ? 0 : 1;
                        break;
                        case 1: ct += t.canSee(t.x + i - 1, t.y + j) ? 0 : 1;
                        break;
                        case 2: ct += t.canSee(t.x + i, t.y + j + 1) ? 0 : 1;
                        break;
                        case 3: ct += t.canSee(t.x + i, t.y + j - 1) ? 0 : 1;
                        break;
                    }
                }
            }
        }
    }
    return ct;
}

function getStrategy(){
    let max = 0, bestEva = new Evaluation(0,0,0);
    tetris.erase();
    let tmp = new Tetest(tetris.shape,tetris.ctx,tetris.x,tetris.y,'rgb(1,1,1,1)','rgb(111,111,111)')
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            tmp.data[i][j] = tetris.data[i][j];  
        }
    }
    for(let r = 0; r < 4; r++){
        tmp.x = tetris.x;
        tmp.y = tetris.y;
        if(r > 0)
            tmp.rotate();
        while(tmp.moveLeft());
        do{
            tmp.moveDown();
            tmp.draw();
            let score = evaluate(tmp);
            tmp.erase();
            if(score > max){
                max = score;
                bestEva = new Evaluation(r,tmp.x,max)
            }else if(score == max){
                if(Math.floor(Math.random()*2) == 1)
                    bestEva = new Evaluation(r,tmp.x,max)
            }
            tmp.y = tetris.y;
        }while(tmp.moveRight())
    }
    // console.log(max)

    opList.push(new Opration('rotate',bestEva.r));
    let moveAct = bestEva.x - tetris.x > 0 ? 1 : 0;
    let actNum = Math.abs(bestEva.x - tetris.x)
    opList.push(new Opration(MOVEOPS[moveAct],actNum));
    opList.push(new Opration('moveDown',1));

}

function autoTick(){
    if(opList.length == 0){
        getStrategy();
    }else{
        let op = opList.shift();
        for(let i=0; i<op.num; i++){
            tetris[op.op]();
            if(op.op == 'moveDown')
                generateNext();
        }
    }
}

function tick(){
    if(!tetris.moveNext()){
        generateNext();
    }
}

function keyProess(e){
    if(gameState && !isAutoPlay){
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
                tick();
            break;
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

function audioOpenClick(){
    isAudioOpen = document.getElementById('audioOpen').checked;
    document.getElementById('speedShow').focus();
}

function playButtonClick(){
    document.getElementById('playControl').onclick = false;
    document.getElementById('playControl').onmouseout = false;
    document.getElementById('playControl').onmouseover = false;
    document.getElementById('autoPlay').disabled = "";
    document.getElementById('audioOpen').disabled = "";
    document.getElementById('playControl').style.backgroundColor = 'gray'
    gameStart();
}

function autoPlayClick(){
    isAutoPlay = document.getElementById('autoPlay').checked;
    if(isAutoPlay){
        clearInterval(interval)
        interval = setInterval( autoTick, 1 );
    }else{
        clearInterval(interval)
        interval = setInterval( tick, TICKVAL );
    }
    document.getElementById('speedShow').focus();
}

document.getElementById('playControl').onmouseout = cursorMoveOutplayButton;
document.getElementById('playControl').onmouseover = cursorOverPlayButton;
document.getElementById('playControl').onclick = playButtonClick;
document.getElementById('autoPlay').onclick = autoPlayClick;
document.getElementById('audioOpen').onclick = audioOpenClick;

// document.body.onload = gameStart();
