import { Color } from '../colors';
import ShapeStyle from './ShapeStyle';
import { RealRect, ScreenRect } from '@/types/rect';
import { ShapeModel, ShapeState } from '@/types/shapes';


export default class Shape {
    private style: ShapeStyle
    private fillStyle: string = ""
    private model: ShapeModel = {}
    constructor() {
        this.style = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID);
    }

    deactivatePoints() {

    }
    drawSelf(ctx: CanvasRenderingContext2D, realRect: RealRect, screenRect: ScreenRect) {
        this.refresh(realRect, screenRect);
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.fillStyle = this.fillStyle;
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = this.getStyle().getWidth();

    }
    refresh(realRect: RealRect, screenRect: ScreenRect) {

    }
    applyTransform() {

    }
    move(distance: number) {

    }


    getModel() {
        return this.model;
    }
    refreshModel() {
        for (const p of this.properties) {
            p.changed = false;
        }
    }
    setColor(color) {
        this.style.setColor(color);
        this.fillStyle = color
    }
    getColor() {
        return this.style.getColor();
    }
    getStyle() {
        return this.style;
    }

    setStyle(style: ShapeStyle) {
        this.style = style;

    }

    setFillStyle(fill) {
        this.fillStyle = fill;
    }

    getDescription() {
        return 'Shape';
    }
}