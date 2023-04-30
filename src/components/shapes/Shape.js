import { Color } from '../colors';
import ShapeStyle from './ShapeStyle';
import { PropertyTypes, RegExp } from "./PropertyData";
export default class Shape {

    constructor() {
        this.style = new ShapeStyle(Color.BLACK, ShapeStyle.SOLID);
        this.state = { selected: false, inSelection: false, underCursor: false, highlighted: false };
        this.properties = [];
    }
    defineProperties() {
        const thisShape = this;
        for (let p of this.properties) {
            p.parentLabelKeys = [this.getDescription()];
            p.setValue = function (value) {
                this.value = value;
                this.changed = true;
                thisShape.refreshModel();
            }

            switch (p.type) {
                case PropertyTypes.VERTEX:
                    p.show = false;
                    p.selected = false;
                    p.regexp = RegExp.NUMBER;
                    break;
                case PropertyTypes.NUMBER:
                    p.regexp = RegExp.NUMBER;
                    break;
                case PropertyTypes.POSITIVE_NUMBER:
                    p.regexp = RegExp.POSITIVE_NUMBER;
                    break;
                default:
            }
        }
    }
    deactivatePoints() {

    }
    drawSelf(ctx, realRect, screenRect) {
        this.refresh(realRect, screenRect);
        ctx.strokeStyle = this.getStyle().getColor();
        ctx.fillStyle = this.fillStyle;
        ctx.setLineDash(this.getStyle().getStroke());
        ctx.lineWidth = this.getStyle().getWidth();

    }
    applyTransform() {

    }
    move(distance) {

    }
    rotate(basePoint, angle) {

    }
    createMockShape() {

    }
    deleteMockShape() {

    }

    setActivePoint(key) {

    }
    selectPoint(pointIndex) {

    }
    setControlPoint(index, point) {

    }
    getDistanceToControlPoints(point) {
    }
    getProperties() {
        return this.properties;
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

    setStyle(style) {
        this.style = style;

    }

    setFillStyle(fill) {
        this.fillStyle = fill;
    }
    setState(state) {
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