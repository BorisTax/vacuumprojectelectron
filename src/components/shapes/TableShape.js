import Geometry from '../../utils/geometry';
import Shape from "./Shape";
import TextShape from './TextShape';
import TableCellShape from './TableCellShape';
export default class TableShape extends Shape {
    constructor(model) {
        super();
        this.model = { ...model };
        this.table = []
        this.setCaptions(model.captions)
        this.model.list = { primary: [this.header, ...this.model.list["primary"]], secondary: this.model.list["secondary"] }
        this.refreshModel()
        this.properties = [
        ]
        this.defineProperties();
    }
    setCaptions(captions) {
        this.header = ["№", captions.length, captions.width, captions.count, captions.module]
        this.colCount = this.header.length;
        
    }
    drawSelf(ctx, realRect, screenRect, fitRect, fontSize) {
        super.drawSelf(ctx, realRect, screenRect)
        let font;
        if (!fontSize) {
            for (font = 100; font > 2; font--) {
                var { totalColWidth, totalRowHeight, maxColWidth, maxRowHeight } = this.getDimensions(ctx, font);
                if (fitRect.height > totalRowHeight && fitRect.width > totalColWidth) {
                    break;
                }
            }
        } else {
            font = fontSize;
            ({ totalColWidth, totalRowHeight, maxColWidth, maxRowHeight } = this.getDimensions(ctx, font));
        }
        this.model.realTotalColWidth = Geometry.screenToRealLength(totalColWidth, realRect.width, screenRect.width)
        var realMaxRowHeight = Geometry.screenToRealLength(maxRowHeight, realRect.width, screenRect.width)
        var realMaxColWidth = maxColWidth.map((col) => Geometry.screenToRealLength(col, realRect.width, screenRect.width))
        const tableCell = new TableCellShape({ font })
        let rowIndex = 0
        let { x: x0, y: y0 } = Geometry.realToScreen(this.model.topLeft, realRect, screenRect)
        let ry = this.model.topLeft.y;
        const list = { primary: [this.header, ...this.model.list["primary"].slice(1)], secondary: this.model.list["secondary"] }
        for (const listKey of ["primary", "secondary"]) {
            for (const r of list[listKey]) {
                let colIndex = 0
                let x = x0
                let rx = this.model.topLeft.x
                for (const col of r) {
                    tableCell.setText(col);
                    if (rowIndex > 0 && (colIndex === 4)) tableCell.setAlign(TextShape.LEFT); else tableCell.setAlign(TextShape.CENTER);
                    const topLeft = { x: rx, y: ry }
                    const bottomRight = { x: rx + realMaxColWidth[colIndex], y: ry - realMaxRowHeight }
                    tableCell.setPosition(topLeft, bottomRight)
                    tableCell.caption.setFitRect({ width: maxColWidth[colIndex], height: maxRowHeight }, false);
                    tableCell.drawSelf(ctx, realRect, screenRect);
                    x = x + maxColWidth[colIndex]
                    rx = rx + realMaxColWidth[colIndex]
                    colIndex++

                }
                y0 = y0 + maxRowHeight;
                ry = ry - realMaxRowHeight;
                rowIndex++
            }
            ry = ry - realMaxRowHeight;
            y0 = y0 + maxRowHeight;
            if (list["secondary"].length > 0 && listKey === "primary") {
                ctx.fillText(this.model.captions.ext, x0, y0);
                ry = ry - realMaxRowHeight///3;
                y0 = y0 + maxRowHeight;
            }
        }
    }

    refresh(realRect, screenRect) {

    }
    getDimensions(ctx, font, padding = 5) {
        const textShape = new TextShape("");
        let maxRowHeight = 0;
        let maxColWidth = new Array(this.colCount).fill(0);
        for (const listKey of ["primary", "secondary"]) {
            for (let row of this.model.list[listKey]) {
                let colIndex = 0;
                for (let column of row) {
                    textShape.setText(column);
                    const { width, height } = textShape.getTextRect(ctx, `${font}px serif`);
                    maxRowHeight = maxRowHeight < height ? height : maxRowHeight
                    maxColWidth[colIndex] = maxColWidth[colIndex] < width ? width : maxColWidth[colIndex];
                    colIndex++
                }
            }
        }
        maxRowHeight += padding * 2;
        maxColWidth = maxColWidth.map(i => i + padding * 2);
        const totalColWidth = maxColWidth.reduce((i, a) => i + a, 0);
        const totalRowHeight = maxRowHeight * (this.model.list["primary"].length + this.model.list["secondary"].length);
        return { totalColWidth, totalRowHeight, maxColWidth, maxRowHeight }
    }

    refreshModel() {
    }

    isPointInside(p) {
        return (p.x >= this.model.topLeft.x) && (p.x <= this.model.topLeft.x + this.model.length) && (p.y <= this.model.topLeft.y) && (p.y >= this.model.topLeft.y - this.model.width);
    }
    getDistance(point) {

    }
    isInRect(topLeft, bottomRight) {
        return { cross: false, full: false };
    }
    toString() {
        return "Rectangle";
    }
    getDescription() {
        return 'Rectangle';
    }
}