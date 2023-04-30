import Cursor from "./Cursor";

export default class SelectCursor extends Cursor{

    drawSelf(ctx, realRect,  screenRect){
        this.refresh(realRect,screenRect);
        ctx.strokeStyle=this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth=this.getStyle().getWidth();
        let size=15;
        let rectSize=6;
        ctx.beginPath();
        ctx.moveTo(this.p0.x-size,this.p0.y);
        ctx.lineTo(this.p0.x+size,this.p0.y);
        ctx.moveTo(this.p0.x,this.p0.y-size);
        ctx.lineTo(this.p0.x,this.p0.y+size);
        ctx.strokeRect(this.p0.x-rectSize/2,this.p0.y-rectSize/2,rectSize,rectSize);
        ctx.stroke();
        if(this.shiftKey&&!this.altKey) this.drawPlus(ctx,size);
        if(this.altKey) this.drawMinus(ctx,size);
    }
    drawPlus(ctx,size){
        ctx.beginPath();
        ctx.moveTo(this.p0.x+size/4,this.p0.y-size/2);
        ctx.lineTo(this.p0.x+size/4+size/2,this.p0.y-size/2);
        ctx.moveTo(this.p0.x+size/2,this.p0.y-size/4);
        ctx.lineTo(this.p0.x+size/2,this.p0.y-size/4-size/2);
        ctx.stroke();
    }
    drawMinus(ctx, size){
        ctx.beginPath();
        ctx.moveTo(this.p0.x+size/4,this.p0.y-size/2);
        ctx.lineTo(this.p0.x+size/4+size/2,this.p0.y-size/2);
        ctx.stroke();
    }

}
