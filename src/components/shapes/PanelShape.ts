import Geometry, { Intersection, Rectangle } from '../../utils/geometry';
import Shape from "./Shape";
import ShapeStyle from './ShapeStyle';
import { Color } from '../colors';
import { PropertyTypes } from "./PropertyData";
import RectangleShape from './RectangleShape';
import TextShape from './TextShape';
import { PanelShapeModel, PanelShapeState } from '@/types/shapes';
import { Point } from '@/types/geomerty';


export default class PanelShape {
    private highlightedStyle = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID, 2)
    private normalStyle = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID, 1)
    private normalDashStyle = new ShapeStyle(Color.BLACK, ShapeStyle.DASH)
    private highlightedWidth = 2
    private normalWidth = 1
    private pathWidth = 10
    private highlightedPathWidth = 20
    private model: PanelShapeModel
    private state: PanelShapeState= {
        selected: false,
        highlighted: false,
        inSelection: false,
        underCursor: false,
        canBePlaced: false
    }
    constructor(model: PanelShapeModel) {
        this.model = { ...model };
        if (!model.origWidth) this.model.origWidth = this.model.width
        if (!model.origLength) this.model.origLength = this.model.length
        if (model.vertical === undefined) this.model.vertical = true
        if (!model.active) this.model.active = false
        if (!model.bottomRight) this.model.bottomRight = { x: 0, y: 0 }
        if (!model.topLeft) this.model.topLeft = { x: -3000, y: 0 }
        if (!model.position) this.model.position = { x: -10000, y: 0 }
        this.setCenterPosition()
        this.state.canBePlaced = false;
        this.innerRect = new RectangleShape(new Rectangle())
        this.outerRect = new RectangleShape(new Rectangle())
        this.innerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID));
        this.outerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.DASH));
        this.captionShape = new TextShape()
        this.state.selected = true;
        this.state.message = "";
        this.captionShape.setFillStyle(Color.BLACK);
        this.screenRect = {}
    }

    drawSelf(ctx, realRect, screenRect, print = false) {
        super.drawSelf(ctx, realRect, screenRect)
        this.innerRect.setFillStyle(Color.WHITE);
        if (!print) this.outerRect.drawSelf(ctx, realRect, screenRect, false, this.model.margin > 40 ? this.model.outerGlossPath : this.model.outerMattePath, this.model.vertical)
        const highlightedWidth = this.model.innerGlossPath ? this.highlightedPathWidth : this.highlightedWidth 
        const normalWidth = this.model.innerGlossPath ? this.pathWidth : this.normalWidth 
        if (this.state.selected || this.state.highlighted) { this.innerRect.getStyle().setWidth(highlightedWidth) } else { this.innerRect.getStyle().setWidth(normalWidth) }
        this.innerRect.drawSelf(ctx, realRect, screenRect, true, this.model.margin > 40 ? this.model.innerGlossPath : this.model.innerMattePath, this.model.vertical)
        this.captionShape.drawSelf(ctx, realRect, screenRect)
    }
    refresh(realRect, screenRect) {
        let color = this.state.canBePlaced || this.model.placedForce ? Color.BLACK : Color.RED;
        this.innerRect.setColor(color);
        this.outerRect.setColor(color);
        const point = {
            x: (this.innerRect.model.topLeft.x + this.innerRect.model.bottomRight.x) / 2,
            y: (this.innerRect.model.topLeft.y + this.innerRect.model.bottomRight.y) / 2
        }
        this.captionShape.setPoint(point);
        this.captionShape.setColor(color);

        const captionAngle = this.model.length >= this.model.width ? 0 : -Math.PI / 2;
        this.captionShape.rotate(captionAngle);
        const fitRect = {}
        fitRect.width = Geometry.realToScreenLength(this.model.origLength, realRect.width, screenRect.width)
        fitRect.height = this.model.origWidth > 100 ? Geometry.realToScreenLength(this.model.origWidth, realRect.width, screenRect.width) : Geometry.realToScreenLength(this.model.origWidth + this.model.margin, realRect.width, screenRect.width)

        this.captionShape.setFitRect(fitRect);
    }
    setCaption() {
        const ext = this.model.listKey === 'secondary' ? "Доп " : ""
        const module = this.model.module && this.model.drawModule ? this.model.module : "";
        this.caption = ` ${ext}№${this.model.id} ${this.model.origLength}x${this.model.origWidth} ${module} `;
        this.captionShape.setText(this.caption);
    }
    setPosition(pos) {
        this.model.position = { ...pos }
        this.setCenterPosition()
        this.refreshModel()
    }
    getPosition() {
        return this.model.position
    }
    setTableId(id) {
        this.model.tableId = id;
    }
    getTableId(id) {
        return this.model.tableId;
    }
    getId() {
        return this.model.id;
    }
    setId(id) {
        this.model.id = id;
        this.refreshModel();
    }
    getMarkers() {
        let list = [];
        return list;
    }
    flipOrientation() {
        this.model.vertical = !this.model.vertical
        this.setCenterPosition()
        this.refreshModel()
    }
    setPlacedForce(value) {
        this.model.placedForce = value;
    }
    setPath(path){
        this.model.innerGlossPath = path.innerGlossPath
        this.model.innerMattePath = path.innerMattePath
        this.model.outerGlossPath = path.outerGlossPath
        this.model.outerMattePath = path.outerMattePath
        this.innerRect.setStyle(new ShapeStyle(Color.BLACK, ShapeStyle.SOLID, this.pathWidth));
        this.outerRect.setStyle(this.normalDashStyle);
    }
    deletePath(){
        this.model.innerGlossPath = ""
        this.model.innerMattePath = ""
        this.model.outerGlossPath = ""
        this.model.outerMattePath = ""
        this.innerRect.setStyle(this.normalStyle);
        this.outerRect.setStyle(this.normalDashStyle);
    }
    setMargin(value){
        if(value < 0) return
        this.setCenterPosition()
        this.model.margin = value
        this.refreshModel()
    }
    setCenterPosition(){
        this.centerPosition = {x: this.model.position.x + this.model.length / 2  + this.model.margin, y: this.model.position.y - this.model.width / 2 - this.model.margin}
    }
    refreshModel() {
        if (this.model.vertical) {
            this.model.length = this.model.origLength
            this.model.width = this.model.origWidth
        } else {
            this.model.length = this.model.origWidth
            this.model.width = this.model.origLength
        }
        this.model.position.x = this.centerPosition.x - this.model.length / 2 - this.model.margin
        this.model.position.y = this.centerPosition.y + this.model.width / 2 + this.model.margin
        this.setCaption();
        this.model.topLeft = { x: this.model.position.x + this.model.margin, y: this.model.position.y - this.model.margin }
        this.model.bottomRight = { x: this.model.position.x + this.model.margin + this.model.length, y: this.model.position.y - this.model.margin - this.model.width }
        let tl = { ...this.model.position }
        let br = { x: this.model.position.x + this.model.length + this.model.margin * 2, y: this.model.position.y - this.model.width - this.model.margin * 2 }
        this.outerRect.setCorners(tl, br);
        tl = this.model.topLeft;
        br = this.model.bottomRight;
        this.innerRect.setCorners(tl, br);
    }
    isPointInside(p: Point) {
        return (p.x >= this.outerRect.model.topLeft.x) && (p.x <= this.outerRect.model.topLeft.x + this.outerRect.model.width) && (p.y <= this.outerRect.model.topLeft.y) && (p.y >= this.outerRect.model.topLeft.y - this.outerRect.model.height);
    }
    getDistance(point) {

    }
    isInRect({ topLeft, bottomRight }: Rectangle) {
        const inRect = [Geometry.pointInRect(this.model.topLeft, topLeft, bottomRight),
        Geometry.pointInRect(this.model.bottomRight, topLeft, bottomRight)];
        const full = inRect.every(i => i === true);
        const cross = Intersection.RectangleRectangle(topLeft, bottomRight, this.model.topLeft, this.model.bottomRight).length > 0;
        return { cross, full };
    }

    setState(state: PanelShapeState) {
        this.state = { ...this.state, ...state };
        if (this.state.selected === true) {
            this.setStyle(this.normalStyle);
            if (this.state.highlighted) this.getStyle().setWidth(this.highlightedWidth);
            return;
        } else {
            this.setStyle(this.normalStyle);
        }
        if (this.state.highlighted) this.setStyle(this.highlightedStyle);
    }
    getState() {
        return this.state;
    }

}