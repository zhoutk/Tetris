"use strict";

const BLOCKWIDTH = 30;

class Block{
    constructor(ctx,fillColor,strokeColor){
        this.ctx = ctx;
        this.width = BLOCKWIDTH;
        this.fillColor = fillColor || 'blue';
        this.strokeColor = strokeColor || 'white';
    }
    draw(x,y){
        this.ctx.save();
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(x*this.width,y*this.width,this.width-2,this.width-2)
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.strokeRect(x*this.width,y*this.width,this.width-2,this.width-2);
        this.ctx.restore();
    }
}

module.exports = Block;
