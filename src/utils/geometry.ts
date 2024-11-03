import { Line, Point, Rectangle, RLine, SLine, Vector } from "@/types/geomerty";
function createSLine(p1: Point, p2: Point): SLine{
    const line: SLine = {
        a: p1.y - p2.y,
        b: p2.x - p1.x,
        c: p1.x * p2.y - p1.y * p2.x
    }
    return line
}

export function createSLineByABC(a: number, b: number, c: number): SLine{
    return {a, b, c}
}
export function createSLineByTwoPoints(p1: Point, p2: Point): SLine{
    return createSLine(p1, p2)
}
export function createSLineByPointAndVector(p: Point, vector: Vector): SLine {
    return createSLine(p, { x: p.x + vector.x, y: p.y + vector.y })
}
export function createSLineByLine(line: Line): SLine{
    return createSLine(line.p1, line.p2)
}

export function getSLineYbyX(line: SLine, x: number) {
    if (line.b !== 0) return -(line.a * x + line.c) / line.b; else return NaN;
}
export function getSLineXbyY(line: SLine, y: number) {
    if (line.a !== 0) return -(line.b * y + line.c) / line.a; else return NaN;
}

export function createRLine(p1: Point, p2: Point): RLine {
    return {
        origin: p1,
        vector: { x: p2.x - p1.x, y: p2.y - p1.y }
    }
}
export function getRLineYbyX(line: RLine, x: number) {
    const sline = createSLineByPointAndVector(line.origin, line.vector)
    if (sline.b !== 0) {
        let y = -(sline.a * x + sline.c) / sline.b;
        if (((x - line.origin.x) * line.vector.x) >= 0 && ((y - line.origin.y) * line.vector.y) >= 0) return y;
        return NaN;
    }
    else return NaN;
}

export function getRLineXbyY(line: RLine, y: number) {
    const sline = createSLineByPointAndVector(line.origin, line.vector)
    if (sline.a !== 0) {
        let x = -(sline.b * y + sline.c) / sline.a;
        if (((x - line.origin.x) * line.vector.x) >= 0 && ((y - line.origin.y) * line.vector.y) >= 0) return y;
        return NaN;
    } else return NaN;
}

export function getVectorModulus(v: Vector){
    return Math.sqrt(v.x * v.x + v.y * v.y)
}


export function createRectangle(topLeft: Point, bottomRight: Point): Rectangle {
    const tl = {
        x: topLeft.x > bottomRight.x ? bottomRight.x : topLeft.x,
        y: topLeft.y < bottomRight.y ? bottomRight.y : topLeft.y
    }
    const width = Math.abs(bottomRight.x - topLeft.x)
    const height = Math.abs(bottomRight.y - topLeft.y)
    return {
        topLeft: tl,
        width,
        height,
        bottomRight: {
            x: tl.x + width, y: tl.y - height
        }
    }
}
export function createRectangleByPoints(x1: number, y1: number, x2: number, y2: number): Rectangle {
    return createRectangle({ x: x1, y: y1 }, { x: x2, y: y2 })
}

export class Intersection{
    static SLineSLine(line1: SLine, line2: SLine) {
        let d = line1.a * line2.b - line1.b * line2.a;
        if (d === 0) return null;
        let d1 = -line1.c * line2.b - (-line2.c * line1.b);
        let d2 = -line2.c * line1.a - (-line1.c * line2.a);
        return { x: d1 / d, y: d2 / d };
    }
    static LineSLine(line:Line, sline:SLine) {
        let p = Intersection.SLineSLine(sline, createSLineByLine(line));
        if (p === null) return null;
        if (!Geometry.pointOnLine(p, line.p1, line.p2)) return null;
        return p;
    }
    static RectangleSLine(rectTopLeft: Point, rectBottomRight: Point, line: SLine) {
        let lines = new Array(4);
        let points: Point[] = [];
        lines[0] = { p1: { x: rectTopLeft.x, y: rectTopLeft.y }, p2: { x: rectBottomRight.x, y: rectTopLeft.y } };
        lines[1] = { p1: { x: rectTopLeft.x, y: rectBottomRight.y }, p2: { x: rectBottomRight.x, y: rectBottomRight.y } };
        lines[2] = { p1: { x: rectTopLeft.x, y: rectTopLeft.y }, p2: { x: rectTopLeft.x, y: rectBottomRight.y } };
        lines[3] = { p1: { x: rectBottomRight.x, y: rectTopLeft.y }, p2: { x: rectBottomRight.x, y: rectBottomRight.y } };
        lines.forEach(l => {
            const p = Intersection.LineSLine(l, line)
            if (p && points.length < 2) points.push(p);
        });
        return points;
    }
    static RectangleRLine(rectTopLeft: Point, rectBottomRight: Point, line: RLine) {
        const ps = Intersection.RectangleSLine(rectTopLeft, rectBottomRight, createSLineByPointAndVector(line.origin, line.vector));
        const points: Point[] = [];
        ps.forEach(p => { if (Geometry.isPointOnRayLine(line, p)) points.push(p) });
        return points;
    }

    static RectangleRectangle(rectTopLeft1: Point, rectBottomRight1: Point, rectTopLeft2: Point, rectBottomRight2: Point) {
        const lines1 = [{ p1: { x: rectTopLeft1.x, y: rectTopLeft1.y }, p2: { x: rectBottomRight1.x, y: rectTopLeft1.y } },
        { p1: { x: rectBottomRight1.x, y: rectTopLeft1.y }, p2: { x: rectBottomRight1.x, y: rectBottomRight1.y } },
        { p1: { x: rectTopLeft1.x, y: rectBottomRight1.y }, p2: { x: rectBottomRight1.x, y: rectBottomRight1.y } },
        { p1: { x: rectTopLeft1.x, y: rectTopLeft1.y }, p2: { x: rectTopLeft1.x, y: rectBottomRight1.y } }];
        const lines2 = [{ p1: { x: rectTopLeft2.x, y: rectTopLeft2.y }, p2: { x: rectBottomRight2.x, y: rectTopLeft2.y } },
        { p1: { x: rectBottomRight2.x, y: rectTopLeft2.y }, p2: { x: rectBottomRight2.x, y: rectBottomRight2.y } },
        { p1: { x: rectTopLeft2.x, y: rectBottomRight2.y }, p2: { x: rectBottomRight2.x, y: rectBottomRight2.y } },
        { p1: { x: rectTopLeft2.x, y: rectTopLeft2.y }, p2: { x: rectTopLeft2.x, y: rectBottomRight2.y } }];
        const ps: Point[] = [];
        lines1.forEach(l1 => {
            lines2.forEach((l2) => {
                const p = Intersection.LineLine(l1, l2);
                if (p) ps.push(p);
            })
        })
        return ps; 
    }
    static LineRectangle(line: Line, rectTopLeft: Point, rectBottomRight: Point) {
        let lines = new Array(4);
        let points: Point[] = [];
        lines[0] = { p1: { x: rectTopLeft.x, y: rectTopLeft.y }, p2: { x: rectBottomRight.x, y: rectTopLeft.y } };
        lines[1] = { p1: { x: rectTopLeft.x, y: rectBottomRight.y }, p2: { x: rectBottomRight.x, y: rectBottomRight.y } };
        lines[2] = { p1: { x: rectTopLeft.x, y: rectTopLeft.y }, p2: { x: rectTopLeft.x, y: rectBottomRight.y } };
        lines[3] = { p1: { x: rectBottomRight.x, y: rectTopLeft.y }, p2: { x: rectBottomRight.x, y: rectBottomRight.y } };
        lines.forEach(l => {
            const p = Intersection.LineLine(line, l)
            if (p && points.length < 2) points.push(p);
        });
        return points;
    }
    static LineLine(l1: Line, l2: Line) {
        const p=Intersection.SLineSLine(createSLineByLine(l1), createSLineByLine(l2));
        if(p){
            if(Geometry.pointOnLine(p, l1.p1, l1.p2)&&Geometry.pointOnLine(p, l2.p1, l2.p2)) return p;
        }
        return null;
    }
    // static CircleSLine(circle,line) {
    //     let dx = -circle.center.x;
    //     let dy = -circle.center.y;
    //     let sline = Geometry.LineShifted(line, dx, dy);
    //     let a = sline.a;
    //     let b = sline.b;
    //     let c = sline.c;
    //     let r = circle.radius;
    //     if (b === 0) {
    //         a = sline.b;
    //         b = sline.a;
    //     }
    //     let A = a * a + b * b;
    //     let B = 2 * a * c;
    //     let C = c * c - r * r * b * b;
    //     let x = Geometry.QuadEquation(A, B, C);
    //     if (x === null) return null;
    //     let res = new Array(x.length);
    //     for (let i = 0; i < x.length; i++) {
    //         res[i] = new Coord2D();
    //         if (sline.b === 0) {
    //             res[i].y = x[i];
    //             res[i].x = -(a * x[i] + c) / b;
    //         } else {
    //             res[i].x = x[i];
    //             res[i].y = -(a * x[i] + c) / b;
    //         }
    //         res[i].x = res[i].x - dx;
    //         res[i].y = res[i].y - dy;
    //     }
    //     return res;
    // }

    // static CircleRLine(circle,line) {
    //     let points = Intersection.CircleSLine(circle, new SLine(line.origin, new Coord2D(line.origin.x+line.vector.x,line.origin.y+line.vector.y)));
    //     if (points === null) return null;
    //     let k = 0;
    //     let i = 0;
    //     for (let p of points) {

    //         if (Geometry.isPointOnRayLine(line, p)) k++; else points[i] = null;
    //         i++;
    //     }
    //     if (k === 0) return null;
    //     let res = new Array(k);
    //     k = 0;
    //     for (let p of points) if (p != null) {
    //         res[k++] = p;
    //     }
    //     return res;
    // }
}

export default class Geometry {

    static realToScreenLength(value: number, realWidth: number, viewPortWidth: number){
        return Math.trunc(value / (realWidth / viewPortWidth));
    }
    static screenToRealLength(value: number, realWidth: number, viewPortWidth: number){
        return Math.trunc(value * (realWidth/viewPortWidth));
    }


    static SLinePerpOnPoint(line: SLine, p: Point) {
        return createSLineByABC(-line.b, line.a, -line.a * p.y + line.b * p.x);
    }

    static LineShifted(line: SLine, dx: number, dy: number) {
        let p = new Array(2);
        for (let i = 0; i < 2; i++) {
            let x = i;
            let y = getSLineYbyX(line, x);
            if (isNaN(y)) {
                y = i;
                x = getSLineXbyY(line, y);
            }
            x = x + dx;
            y = y + dy;
            p[i] = { x, y }
        }
        return createSLineByTwoPoints(p[0], p[1]);
    }


    static pointInRect(p: Point, rectTopLeft: Point, rectBottomRight: Point, borders = true) {
        let sx = (p.x - rectBottomRight.x) * (p.x - rectTopLeft.x);
        let sy = (p.y - rectBottomRight.y) * (p.y - rectTopLeft.y);
        let x = borders ? sx <= 0 : sx < 0
        let y = borders ? sy <= 0 : sy < 0
        return (x && y);
    }

    static pointInRectByPoints(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
        if ((x >= x1 && x <= x2) && (y <= y1 && y >= y2)) return true;
        return false;
    }
    static linesIntersection(l1: Line, l2: Line) {
        const p = Intersection.SLineSLine(createSLineByLine(l1), createSLineByLine(l2));
        return (p && Geometry.pointOnLine(p, l1.p1, l1.p2, false) && Geometry.pointOnLine(p, l2.p1, l2.p2, false));
    }

    static rectIntersection(rect1: Rectangle, rect2: Rectangle) {
        let res = false;
        res = intersect(rect1, rect2)
        if (!res) { res = intersect(rect2, rect1) }
        if (!res) { res = Geometry.rectIntersection2(rect1, rect2) }
        if (!res) { res = Geometry.rectIntersection2(rect2, rect1) }
        return res;
        function intersect(r1: Rectangle, r2: Rectangle) {
            if (Geometry.pointInRect(r1.topLeft, r2.topLeft, r2.bottomRight, false)) return true;
            if (Geometry.pointInRect(r1.bottomRight, r2.topLeft, r2.bottomRight, false)) return true;
            if (Geometry.pointInRect({ x: r1.topLeft.x, y: r1.bottomRight.y }, r2.topLeft, r2.bottomRight, false)) return true;
            if (Geometry.pointInRect({ x: r1.bottomRight.x, y: r1.topLeft.y }, r2.topLeft, r2.bottomRight, false)) return true;
            return false;
        }
    }
    static rectIntersection2(rect1: Rectangle,rect2: Rectangle){
        const d={p1:rect1.topLeft,p2:rect1.bottomRight}
        const l1={p1:rect2.topLeft,p2:{x:rect2.topLeft.x,y:rect2.bottomRight.y}}
        const l2={p1:rect2.topLeft,p2:{x:rect2.bottomRight.x,y:rect2.topLeft.y}}
        const l3={p1:rect2.bottomRight,p2:{x:rect2.topLeft.x,y:rect2.bottomRight.y}}
        const l4={p1:rect2.bottomRight,p2:{x:rect2.bottomRight.x,y:rect2.topLeft.y}}
        return[
            Geometry.linesIntersection(d,l1),
            Geometry.linesIntersection(d,l2),
            Geometry.linesIntersection(d,l3),
            Geometry.linesIntersection(d,l4),
        ].some(i=>i);
    }

    static rectInRect(innerRect: Rectangle, outerRect: Rectangle) {
        return [
            Geometry.pointInRect(innerRect.topLeft, outerRect.topLeft, outerRect.bottomRight, true),
            Geometry.pointInRect({ x: innerRect.topLeft.x, y: innerRect.bottomRight.y }, outerRect.topLeft, outerRect.bottomRight, true),
            Geometry.pointInRect({ x: innerRect.bottomRight.x, y: innerRect.topLeft.y }, outerRect.topLeft, outerRect.bottomRight, true),
            Geometry.pointInRect(innerRect.bottomRight, outerRect.topLeft, outerRect.bottomRight, true),
        ].every(p => p);
    }
    static rectToRectDist(rect1: Rectangle, rect2: Rectangle) {
        const c1 = { x: (rect1.topLeft.x + rect1.bottomRight.x) / 2, y: (rect1.topLeft.y + rect1.bottomRight.y) / 2 }
        const c2 = { x: (rect2.topLeft.x + rect2.bottomRight.x) / 2, y: (rect2.topLeft.y + rect2.bottomRight.y) / 2 }
        return Geometry.distance(c1, c2)
    }
    static minPointToRectDist(p: Point, rect: Rectangle) {
        var left = Math.abs(p.x - rect.topLeft.x)
        var right = Math.abs(p.x - rect.bottomRight.x)
        var top = Math.abs(p.y - rect.topLeft.y)
        var bottom = Math.abs(p.y - rect.bottomRight.y)
        const dx = { dist: Math.min(left, right), posX: left < right ? rect.topLeft.x : rect.bottomRight.x }
        const dy = { dist: Math.min(top, bottom), posY: top < bottom ? rect.topLeft.y : rect.bottomRight.y }
        return { dx, dy };
    }

    static minRectDist(rect1: Rectangle, rect2: Rectangle, outer = true) {
        function isOverlapped(p1: number, p2: number, p3: number, p4: number) {
            let d = Math.max(p1, p2, p3, p4) - Math.min(p1, p2, p3, p4)
            return d < (Math.abs(p1 - p2) + Math.abs(p3 - p4))
        }
        let dx = { dist: NaN, pos: 0, front: false }, dy = { dist: NaN, pos: 0, front: false };
        if (isOverlapped(rect1.topLeft.y, rect1.bottomRight.y, rect2.topLeft.y, rect2.bottomRight.y)) {
            let dxFront = outer ? rect2.bottomRight.x - rect1.topLeft.x : rect1.topLeft.x - rect2.topLeft.x
            let dxBack = outer ? rect2.topLeft.x - rect1.bottomRight.x : rect2.bottomRight.x - rect1.bottomRight.x
            dx.front = Math.abs(dxFront) < Math.abs(dxBack)
            if (outer) dx.pos = dx.front ? rect2.bottomRight.x : rect2.topLeft.x; else dx.pos = dx.front ? rect2.topLeft.x : rect2.bottomRight.x;
            dx.dist = dx.front ? dxFront : dxBack
        }
        if (isOverlapped(rect1.topLeft.x, rect1.bottomRight.x, rect2.topLeft.x, rect2.bottomRight.x)) {
            let dyFront = outer ? rect2.bottomRight.y - rect1.topLeft.y : rect2.topLeft.y - rect1.topLeft.y
            let dyBack = outer ? rect2.topLeft.y - rect1.bottomRight.y : rect2.bottomRight.y - rect1.bottomRight.y
            dy.front = Math.abs(dyFront) < Math.abs(dyBack)
            if (outer) dy.pos = dy.front ? rect2.bottomRight.y : rect2.topLeft.y; else dy.pos = dy.front ? rect2.topLeft.y : rect2.bottomRight.y;
            dy.dist = dy.front ? dyFront : dyBack
        }
        return { dx, dy }
    }
    static pointOnLine(p: Point, p1: Point, p2: Point, includeTips = true) {
        if (!p || !p1 || !p2) return false;
        const sx = Math.round((p.x - p1.x) * (p.x - p2.x) * 100000) / 100000;
        const sy = Math.round((p.y - p1.y) * (p.y - p2.y) * 100000) / 100000;
        const res = includeTips ? (sx <= 0 && sy <= 0) : ((sx < 0 && sy <= 0) || (sx <= 0 && sy < 0))
        return res;
    }

    static pointOnSLineProjection(p: Point, line: SLine){
        return Intersection.SLineSLine(line, Geometry.SLinePerpOnPoint(line, p)) || p;
    }
    static  PointToSLineDistance(p: Point, line: SLine){
        let res=Geometry.distance(p, Geometry.pointOnSLineProjection(p, line));
        return res;
    }

    static PointToRLineDistance(p: Point, line: RLine){
        let point=Geometry.pointOnSLineProjection(p, createSLineByPointAndVector(line.origin, line.vector));
        let res;
        if(Geometry.isPointOnRayLine(line,point)) res=Geometry.distance(p,point);else res=Geometry.distance(p,line.origin);
        return res;
    }
    static PointToLineDistance(p: Point, line: Line) {
        let point = Geometry.pointOnSLineProjection(p, createSLineByLine(line));
        let res;
        if (point && Geometry.pointOnLine(point, line.p1, line.p2)) res = Geometry.distance(p, point);
        else res = Math.min(Geometry.distance(p, line.p1), Geometry.distance(p, line.p2));
        return res;
    }
    static midPoint(p1: Point, p2: Point) {
        return { x: (p2.x + p1.x) / 2, y: (p2.y + p1.y) / 2 };
    }

    static scalar(v1: Vector, v2: Vector) {
        return v1.x * v2.x + v1.y * v2.y;
    }


    static angleVectors(v1: Vector, v2: Vector) {
        const sign = Math.sign(v1.x * v2.y - v2.x * v1.y)
        return Math.acos(this.scalar(v1, v2) / (getVectorModulus(v1) * getVectorModulus(v2))) * sign;
    }

    // static arcCenterPoint(p1, p2, p3) {
    //     let line1 = new SLine(p1, p2);
    //     let line2 = new SLine(p2, p3);
    //     let midp1 = Geometry.midPoint(p1, p2);
    //     let midp2 = Geometry.midPoint(p2, p3);
    //     let pline1 = Geometry.SLinePerpOnPoint(line1, midp1);
    //     let pline2 = Geometry.SLinePerpOnPoint(line2, midp2);
    //     return Intersection.SLineSLine(pline1, pline2);
    // }

    static isPointOnRayLine(line: RLine, point: Point) {
        return (((point.x - line.origin.x) * line.vector.x) >= 0 && ((point.y - line.origin.y) * line.vector.y) >= 0);
    }

    // static arcMiddlePoint(arc) {
    //     let mp = Geometry.midPoint(arc.first, arc.third);
    //     let m = Math.sqrt((mp.x - arc.center.x) * (mp.x - arc.center.x) + (mp.y - arc.center.y) * (mp.y - arc.center.y));
    //     return new Coord2D(arc.radius / m + arc.center.x, arc.radius / m + arc.center.y);
    // }

    // static arcToPointArray(arc, limit) {
    //     if (arc.chord <= limit) {
    //         let res = new Array(2);
    //         res[0] = arc.first;
    //         res[1] = arc.third;
    //         return res;
    //     }
    //     let mp = Geometry.arcMiddlePoint(arc);
    //     let first = Geometry.arcToPointArray(Geometry.arcByTwoPointsCenter(arc.first, mp, arc.center), limit);
    //     let second = Geometry.arcToPointArray(Geometry.arcByTwoPointsCenter(mp, arc.third, arc.center), limit);
    //     let len = first.length - 1 + second.length;
    //     let res = new Array(len);
    //     for (let i = 0; i <= len; i++) {
    //         if (i < first.length - 1) res[i] = first[i];
    //         else res[i] = second[i];
    //     }
    //     return res;
    // }

    // static arcByTwoPointsCenter(p1, p2, c) {
    //     let mp = Geometry.midPoint(p1, p2);
    //     let m = Math.sqrt((mp.x - c.x) * (mp.x - c.x) + (mp.y - c.y) * (mp.y - c.y));
    //     let r = Math.sqrt((p1.x - c.x) * (p1.x - c.x) + (p1.y - c.y) * (p1.y - c.y));
    //     return new Arc(p1, new Coord2D(r / m + c.x, r / m + c.y), p2);
    // }

    // static arcLength(arc) {
    //     let v1 = new Vector(arc.center, arc.first);
    //     let v2 = new Vector(arc.center, arc.third);
    //     let a = Geometry.angleVectors(v1, v2);
    //     return a * arc.radius;
    // }

    // static QuadEquation(a, b, c) {
    //     if (a === 0) return null;
    //     let d = b * b - 4 * a * c;
    //     if (d < 0) return null;
    //     let res = [];
    //     if (d === 0) {
    //         res = [];
    //         res[0] = -b / (2 * a);
    //         return res;
    //     }
    //     res = [];
    //     res[0] = (-b + Math.sqrt(d)) / (2 * a);
    //     res[1] = (-b - Math.sqrt(d)) / (2 * a);
    //     return res;
    // }
    static distance(p1: Point, p2: Point) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    static rotatePoint(point: Point, angle: number, center: Point) {
        let p = { x: point.x - center.x, y: point.y - center.y };
        return {
            x: p.x * Math.cos(angle) - p.y * Math.sin(angle) + center.x,
            y: p.x * Math.sin(angle) + p.y * Math.cos(angle) + center.y
        };
    }
    static screenToReal(x: number, y: number, viewPortWidth: number, viewPortHeight: number, topLeft: Point, bottomRight: Point) {
        let realWidth = bottomRight.x - topLeft.x;
        let realHeight = topLeft.y - bottomRight.y;
        let rx = x / viewPortWidth * realWidth + topLeft.x;
        let ry = topLeft.y - y / viewPortHeight * realHeight;
        return { x: rx, y: ry };
    }
    static realToScreen(point: Point, realRect: Rectangle, screenRect: Rectangle) {
        let ratio = realRect.width / screenRect.width;
        let x = Math.trunc((point.x - realRect.topLeft.x) / ratio);
        let y = -Math.trunc((point.y - realRect.topLeft.y) / ratio);
        return { x, y };
    }
}


