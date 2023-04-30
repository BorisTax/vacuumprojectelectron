import Cursor from "./Cursor";

export default class DrawCursor extends Cursor{

    drawSelf(ctx, realRect,  screenRect){
        this.refresh(realRect,screenRect);
        ctx.strokeStyle=this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth=this.getStyle().getWidth();
        let size=10;
        ctx.beginPath();
        ctx.moveTo(this.p0.x-size+0.5,this.p0.y+0.5);
        ctx.lineTo(this.p0.x+size+0.5,this.p0.y+0.5);
        ctx.moveTo(this.p0.x+0.5,this.p0.y-size+0.5);
        ctx.lineTo(this.p0.x+0.5,this.p0.y+size+0.5);
        ctx.stroke();
    }
}
