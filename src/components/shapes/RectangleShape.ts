import Geometry, { createRectangleByPoints } from '../../utils/geometry';
import Shape from "./Shape";
import { PropertyTypes } from "./PropertyData";
import { RectangleShapeModel } from '@/types/shapes';
import { Rectangle } from '@/types/geomerty';
export default class RectangleShape extends Shape {
    private model: RectangleShapeModel
    private rect = createRectangleByPoints(0,0,0,0)
    private angle = 0
    private vertical = true
    constructor(model: RectangleShapeModel) {
        super();
        this.model = model;
        this.properties = [
            { type: PropertyTypes.VERTEX, value: model.topLeft, labelKey: "p1" },
            { type: PropertyTypes.VERTEX, value: model.bottomRight, labelKey: "p2" },
        ]
        this.defineProperties();
    }

    drawSelf(ctx, realRect, screenRect, fill = false, path, vertical) {
        super.drawSelf(ctx, realRect, screenRect)
        let x = Math.trunc(this.rect.topLeft.x) + 0.5
        let y = Math.trunc(this.rect.topLeft.y) + 0.5
        ctx.fillStyle = this.fillStyle;
        if (path) {
            ctx.save()
            const scale = realRect.width / screenRect.width
            if(vertical !== this.vertical) this.angle = (this.angle + 1) % 4
            this.vertical = vertical
            const angle = this.angle * Math.PI / 2 
            switch (this.angle){
                case 0: 
                    ctx.translate(x, y)
                    break;
                case 1:
                    ctx.translate(x + this.rect.width, y)
                    break;
                case 2:
                    ctx.translate(x + this.rect.width, y + this.rect.height)
                    break;
                case 3:
                    ctx.translate(x, y + this.rect.height)
                    break;
                default:
            }
            
            ctx.rotate(angle)
            ctx.scale(1 / scale, 1 / scale)
            ctx.beginPath()
            console.log(this.style)
            const p = new Path2D(`${path}`)
            ctx.stroke(p)
            if (fill) ctx.fill(p)
            ctx.restore()
            return
        }
        if (fill) {
            ctx.fillRect(x, y, this.rect.width, this.rect.height);
        }
        ctx.strokeRect(x, y, this.rect.width, this.rect.height);
    }
    refresh(realRect, screenRect) {
        this.rect.topLeft = Geometry.realToScreen(this.model.topLeft, realRect, screenRect);
        this.rect.bottomRight = Geometry.realToScreen(this.model.bottomRight, realRect, screenRect);
        this.rect.width = this.rect.bottomRight.x - this.rect.topLeft.x
        this.rect.height = this.rect.bottomRight.y - this.rect.topLeft.y
    }
    getMarkers() {
        let list = [];
        return list;
    }
    setCorners(topLeft, bottomRight) {
        this.properties[0].value = { x: topLeft.x, y: topLeft.y }
        this.properties[1].value = { x: bottomRight.x, y: bottomRight.y }
        this.refreshModel()
    }
    refreshModel() {
        this.model.topLeft = this.properties[0].value;
        this.model.bottomRight = this.properties[1].value;
        this.model.width = this.model.bottomRight.x - this.model.topLeft.x;
        this.model.height = this.model.topLeft.y - this.model.bottomRight.y;
    }
    getDistance(point) {
        let tl = this.model.topLeft;
        let tr = new Coord2D(tl.x + this.model.width, tl.y);
        let bl = new Coord2D(tl.x, tl.y - this.model.height);
        let br = new Coord2D(tl.x + this.model.width, tl.y - this.model.height);
        let top = new Line(tl, tr);
        let bottom = new Line(bl, br);
        let right = new Line(tr, br);
        let left = new Line(tl, bl);
        return Math.min(Geometry.PointToLineDistance(point, top),
            Geometry.PointToLineDistance(point, left),
            Geometry.PointToLineDistance(point, bottom),
            Geometry.PointToLineDistance(point, right));
    }
    isInRect(topLeft, bottomRight) {
        const inRect = [Geometry.pointInRect(this.model.topLeft, topLeft, bottomRight),
        Geometry.pointInRect(this.model.bottomRight, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.model.topLeft, this.model.bottomRight).length > 0;
        return { cross, full };
    }
    toString() {
        return "Rectangle";
    }
    getDescription() {
        return 'Rectangle';
    }
}