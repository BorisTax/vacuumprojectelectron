import Cursor from "./Cursor";

export default class DragCursor extends Cursor{
    drawSelf(ctx, realRect,  screenRect){
        this.refresh(realRect,screenRect);
        ctx.strokeStyle=this.getStyle().getColor();
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth=2;
        const path=new Path2D(`M${this.p0.x} ${this.p0.y-10}l0 6.89m-7.37 0.49c-0.41,-1.46 2.33,-3.73 3.87,-0.49 0,-3.73 -0.06,-3.65 0,-5.4 0.02,-2.87 3.02,-2.87 3.5,-1.49 0.14,-2.96 3.52,-3.04 3.81,-0.08 0.33,-1.54 3.24,-1.46 3.43,0.47 0.24,-0.73 2.75,-1.44 3,1.37 0.09,0.99 -0.01,4.36 -0.02,6.51 -0.73,11.83 -15.65,11.02 -17.59,-0.89zm11.18 -7.46l0 6.97m3.43 -6.5l0 6.5`);
        ctx.fill(path);
        ctx.stroke(path);
    }

}
