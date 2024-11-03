export type Point = {
    x: number,
    y: number
}

export type Line = {
    p1: Point,
    p2: Point
}

export type SLine = {
    a: number,
    b: number,
    c: number
}

export type RLine = {
    origin: Point,
    vector: Vector
}

export type Vector = {
    x: number,
    y: number
}

export type Rectangle = {
    topLeft: Point,
    bottomRight: Point,
    width: number,
    height: number
}