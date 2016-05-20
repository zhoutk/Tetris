"use strict";

var Tetris = require('./tetris')
var randNum = Math.floor(Math.random()*7)
var tetris = new Tetris(randNum)

function gameStart(){
    tetris.draw();
}

function keyProess(e){
    // e = e || window.event;  
    switch(e.keyCode){  
        case 37:  //left key up
            // alert('left')
            console.log('left press : ' + tetris.canSee(0,1));
            break;  
        case 38:  //up key up
            tetris.erase() 
            tetris.rotate()
            tetris.draw()
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
