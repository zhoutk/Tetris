"use strict";

const BLOCKWIDTH = 30;

class Block{
    constructor(ct,fillColor,strokeColor){
        this.ct = ct;
        this.width = BLOCKWIDTH;
        this.fillColor = fillColor || 'blue';
        this.strokeColor = strokeColor || 'white';
    }
    draw(x,y){
        this.ct.save();
        this.ct.fillStyle = this.fillColor;
        this.ct.fillRect(x,y,this.width-2,this.width-2)
        this.ct.strokeStyle = this.strokeColor;
        this.ct.strokeRect(x,y,this.width-2,this.width-2);
        this.ct.restore();
    }
}

module.exports = Block;
