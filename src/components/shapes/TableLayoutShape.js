import Geometry, { Intersection, Rectangle } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import { PropertyTypes } from "./PropertyData";
import RectangleShape from './RectangleShape';
import TableShape from './TableShape';
import TextShape from './TextShape';
export default class TableLayoutShape extends Shape {
    static SMALL = "small"
    static BIG = "big"
    constructor(model, captions) {
        super();
        this.captions = captions
        this.model = { ...model, bottomRight: { x: model.length, y: model.topLeft.y - model.width } };
        this.model.type = model.type === undefined ? TableLayoutShape.SMALL : model.type
        ;[this.model.length, this.model.width] = this.model.type === TableLayoutShape.SMALL ? [2700, 1240] : [2710, 1310]
        this.innerRect = new RectangleShape(new Rectangle())
        this.outerRect = new RectangleShape(new Rectangle())
        this.bridges = [500, 740, 980, 1070, 1300, 1500, 1630]
        this.refreshModel()
        this.outerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.innerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.DASH));
        this.shapeIndex = new TextShape();
        this.shapeIndex.setAnchor({ vertical: TextShape.TOP, horizontal: TextShape.LEFT });
        this.table = new TableShape({
            topLeft: { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y },
            list: { primary: [], secondary: [] },
            captions: this.captions
        })
        this.properties = [
            { type: PropertyTypes.STRING, labelKey: "name", public: true },
            { type: PropertyTypes.STRING, labelKey: "dimensions", public: true },
            { type: PropertyTypes.VERTEX, labelKey: "position" },
            { type: PropertyTypes.BOOL, labelKey: "orientation" },
        ]
        this.defineProperties();
    }
    drawBridges(ctx, realRect, screenRect) {
        this.bridges.forEach(x => {
            const p1 = Geometry.realToScreen({ x, y: this.outerRect.model.topLeft.y }, realRect, screenRect)
            const p2 = Geometry.realToScreen({ x, y: this.outerRect.model.bottomRight.y }, realRect, screenRect)
            ctx.setLineDash(ShapeStyle.DASH)
            ctx.strokeStyle = Color.GRAY
            ctx.beginPath()
            ctx.moveTo(Math.trunc(p1.x) + 0.5, Math.trunc(p1.y) + 0.5)
            ctx.lineTo(Math.trunc(p2.x) + 0.5, Math.trunc(p2.y) + 0.5)
            ctx.stroke()
        })
    }
    drawSelf(ctx, realRect, screenRect, print = false, index) {
        super.drawSelf(ctx, realRect, screenRect)
        this.outerRect.setFillStyle(Color.WHITE)
        if (!print) this.outerRect.setFillStyle(Color.LIGHT_GRAY)
        if (this.model.active) this.outerRect.setStyle(ShapeStyle.ACTIVE_SHAPE); else this.outerRect.setStyle(ShapeStyle.INACTIVE_SHAPE)
        if (print) this.outerRect.setStyle(ShapeStyle.INACTIVE_SHAPE)
        this.outerRect.drawSelf(ctx, realRect, screenRect, true)
        if (!print) {
            this.innerRect.drawSelf(ctx, realRect, screenRect)
            if(this.model.type === TableLayoutShape.SMALL)this.drawBridges(ctx, realRect, screenRect)
        }
        const tableFitRect = {
            width: Geometry.realToScreenLength(this.outerRect.model.width, realRect.width, screenRect.width),
            height: Geometry.realToScreenLength(this.outerRect.model.height, realRect.width, screenRect.width),
        }
        //if(print) 
        tableFitRect.width = tableFitRect.width * 0.5
        this.table.drawSelf(ctx, realRect, screenRect, tableFitRect);
        if (!print) {
            let text = `${this.captions.tableTitle} ${index}  ${this.model.length}x${this.model.width}`
            if (this.model.multiply > 1) text = text + ` x${this.model.multiply}`
            this.shapeIndex.setText(text)
            this.shapeIndex.setPoint({ x: this.outerRect.model.topLeft.x, y: this.outerRect.model.bottomRight.y });
            this.shapeIndex.drawSelf(ctx, realRect, screenRect)
        }
    }
    refresh(realRect, screenRect) {
        let color = Color.BLACK;
        this.innerRect.setColor(color);
        this.outerRect.setColor(color);
        this.table.model.topLeft = { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y }
    }
    setCaptions(captions) {
        this.captions = captions
        this.table.setCaptions(captions)
    }
    setPanelList(panelList) {
        const pList = { primary: {}, secondary: {} }
        for (const l of panelList) {
            if (l.state.canBePlaced || l.model.placedForce)
                if (l.getTableId() === this.model.id) {
                    const id = l.getId()
                    const listKey = l.model.listKey
                    if (pList[listKey][id]) {
                        pList[listKey][id].count += l.model.multiply;
                    } else {
                        pList[listKey][id] = {
                            id,
                            length: l.model.origLength,
                            width: l.model.origWidth,
                            count: l.model.multiply,
                            module: l.model.module ? l.model.module : ""
                        }
                    }
                }
        }

        const list = { primary: [], secondary: [] }
        for (const listKey of ["primary", "secondary"]) {
            let totalCount = 0;
            for (const key in pList[listKey]) {
                list[listKey].push([
                    pList[listKey][key].id,
                    pList[listKey][key].length,
                    pList[listKey][key].width,
                    pList[listKey][key].count,
                    pList[listKey][key].module,

                ])
                totalCount += pList[listKey][key].count
            }
            if (totalCount > 0) list[listKey].push(["", this.captions.total, "", totalCount, ""])
        }
        this.table = new TableShape({
            topLeft: { x: this.outerRect.model.bottomRight.x + 50, y: this.outerRect.model.topLeft.y },
            list, captions: this.captions
        })
    }
    getId() {
        return this.model.id;
    }
    getMarkers() {
        let list = [];
        return list;
    }
    isPointInside(p, inner = false) {
        if (!inner)
            return (p.x >= this.outerRect.model.topLeft.x) && (p.x <= this.outerRect.model.topLeft.x + this.outerRect.model.width) && (p.y <= this.outerRect.model.topLeft.y) && (p.y >= this.outerRect.model.topLeft.y - this.outerRect.model.height);
        else
            return (p.x >= this.innerRect.model.topLeft.x) && (p.x <= this.innerRect.model.bottomRight.x) && (p.y <= this.innerRect.model.topLeft.y) && (p.y >= this.innerRect.model.bottomRight.y);
    }
    isInRect({ topLeft, bottomRight }) {
        const inRect = [Geometry.pointInRect(this.outerRect.model.topLeft, topLeft, bottomRight),
        Geometry.pointInRect(this.outerRect.model.bottomRight, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.outerRect.model.topLeft, this.outerRect.model.bottomRight).length > 0;
        return { cross, full };
    }
    setTopLeft(topLeft) {
        this.model.topLeft = { ...topLeft }
        this.model.bottomRight = { x: topLeft.x + this.model.length, y: topLeft.y - this.model.width };
        this.refreshModel()
    }
    setType(type){
        this.model.type = type
        ;[this.model.length, this.model.width] = this.model.type === TableLayoutShape.SMALL ? [2700, 1240] : [2710, 1310]
        this.refreshModel()
    }
    refreshModel() {
        //this.model.topLeft={x:this.properties[2].value.x+this.model.margin,y:this.properties[2].value.y-this.model.margin}
        //this.model.bottomRight={x:this.properties[2].value.x+this.model.margin+this.model.length,y:this.properties[2].value.y-this.model.margin-this.model.width}
        this.model.bottomRight = {x: this.model.topLeft.x + this.model.length, y: this.model.topLeft.y - this.model.width}
        this.outerRect.setCorners(this.model.topLeft, this.model.bottomRight);
        const tl = { x: this.model.topLeft.x + this.model.marginLength, y: this.model.topLeft.y - this.model.marginWidth };
        const br = { x: this.model.bottomRight.x - this.model.marginLength, y: this.model.bottomRight.y + this.model.marginWidth };
        this.innerRect.setCorners(tl, br);
    }
    getDistance(point) {

    }

    toString() {
        return "Rectangle";
    }
    getDescription() {
        return 'Rectangle';
    }
}