import Geometry from "../../utils/geometry";
import Shape from "./Shape";

export default class TextShape extends Shape {
  static CENTER = 0;
  static LEFT = 1;
  static RIGHT = 2;
  static TOP = 3;
  static BOTTOM = 4;
  constructor(
    text = "",
    point = { x: -3000, y: 0 },
    angle = 0,
    anchor = { vertical: TextShape.CENTER, horizontal: TextShape.CENTER }
  ) {
    super();
    this.p = point;
    this.controlPoints = [this.p];
    this.text = text;
    this.anchor = anchor;
    this.angle = angle;
    this.fitRect = { width: 1000, height: 1000 };
  }
  drawSelf(ctx, realRect, screenRect, fontSize) {
    super.drawSelf(ctx, realRect, screenRect);
    ctx.save();

    let basePoint = { ...this.p0 };
    var { width, height } = this.fitRect;
    const fitWidth = Math.max(this.fitRect.width, this.fitRect.height);
    const fitHeight = Math.min(this.fitRect.width, this.fitRect.height);
    if (!fontSize) {
      for (fontSize = 20; fontSize > 5; fontSize -= 1) {
        ctx.font = `${fontSize}px serif`;
        ({ width, height } = this.getTextRect(ctx, ctx.font));
        if (fitWidth >= width && fitHeight >= height + 5) break;
      }
      this.font = ctx.font;
    } else {
      ctx.font = `${fontSize}px serif`;
      ({ width, height } = this.getTextRect(ctx, ctx.font));
    }
    switch (this.anchor.horizontal) {
      case TextShape.CENTER:
        basePoint.x =
          this.angle === 0 ? this.p0.x - width / 2 : this.p0.x + height / 2;
        break;
      case TextShape.LEFT:
        basePoint.x = this.p0.x + 5;
        break;
      case TextShape.RIGHT:
        basePoint.x = this.p0.x - width;
        break;
      default:
    }
    switch (this.anchor.vertical) {
      case TextShape.CENTER:
        basePoint.y =
          this.angle === 0 ? this.p0.y + height / 2 : this.p0.y + width / 2;
        break;
      case TextShape.TOP:
        basePoint.y = this.angle === 0 ? this.p0.y + height : this.p0.x + width;
        break;
      case TextShape.BOTTOM:
        basePoint.y = this.p0.y;
        break;
      default:
    }
    const newPoint = Geometry.rotatePoint(basePoint, this.angle, {
      x: 0,
      y: 0,
    });
    ctx.translate(basePoint.x - newPoint.x, basePoint.y - newPoint.y);
    ctx.rotate(this.angle);
    ctx.fillText(this.text, basePoint.x, basePoint.y);
    ctx.restore();
  }
  getTextRect(ctx, font) {
    ctx.font = font;
    const textMetrics = ctx.measureText(this.text);
    return {
      width: textMetrics.width,
      height:
        textMetrics.actualBoundingBoxAscent +
        textMetrics.fontBoundingBoxDescent,
    };
  }
  refresh(realRect, screenRect) {
    this.p0 = Geometry.realToScreen(this.p, realRect, screenRect);
  }
  setFitRect(fitRect, fit = true) {
    this.fitRect = { ...fitRect };
    this.fit = fit;
  }
  rotate(angle) {
    this.angle = angle;
  }
  getMarkers() {
    let list = [];
    return list;
  }
  setText(text) {
    this.text = text;
  }
  setFont(font) {
    this.font = font;
  }
  setPoint(point) {
    this.p = point;
  }
  setAnchor(anchor) {
    this.anchor = { ...this.anchor, ...anchor };
  }
  setActivePoint(key) {
    super.setActivePoint();
    if (key === "P1") this.selectPoint(0);
  }
  getProperties() {
    let prop = new Map();
    return prop;
  }
  getDistance(point) {
    return null;
  }
  isInRect(topLeft, bottomRight) {
    return { cross: false, full: false };
  }
  toString() {
    return `Line P1(${this.line.p1.x},${this.line.p1.y}) P2(${this.line.p2.x},${this.line.p2.y})`;
  }
}
