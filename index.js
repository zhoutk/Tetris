"use strict";

var Block = require('./block')
var canvas = document.getElementById('tetris'),  //获取canvas元素
    ctx = canvas.getContext('2d');  //获取画图环境，指明为2d

function gameStart(){
    let b1 = new Block(ctx)
    b1.draw(1,1)
    b1.draw(100,1)
}

function keyProess(e){
    // e = e || window.event;  
    switch(e.keyCode){  
        case 37:  //left key up
            // alert('left')
            console.log('left')
            break;  
        case 38:  //up key up
            alert('up')
            break;  
        case 39:  //right key up
            alert('right')
            break;  
        case 40:  //down key up
            alert('down')
            break;  
    }  
}

document.body.onkeyup = function(e){
    keyProess(e);
}

document.body.onload = gameStart();
