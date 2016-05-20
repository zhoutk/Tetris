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
        this.ctx.fillRect(x*this.width + 1,y*this.width + 1,this.width-2,this.width-2)
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.strokeRect(x*this.width + 1,y*this.width + 1,this.width-2,this.width-2);
        this.ctx.restore();
    }
    erase(x,y){
        this.ctx.clearRect(x*this.width , y*this.width , 30, 30)
    }
    canSee(x,y){
        let c = this.ctx.getImageData(x*this.width+9,y*this.width+9,1,1)
        return c.data[0] | c.data[1] | c.data[2] | c.data[3];
    }
}

module.exports = Block;
