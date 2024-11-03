import { Point } from "./geomerty"

export type PanelShapeModel = {
    width: number,
    length: number,
    origWidth: number,
    origLength: number,
    vertical: boolean,
    active: boolean,
    topLeft: Point,
    bottomRight: Point
    position: Point

}
export type RectangleShapeModel = {
    width: number,
    length: number,
    topLeft: Point,
    bottomRight: Point
}
export type TableShapeModel = {
    
}
export type ShapeModel = PanelShapeModel | TableShapeModel


export type PanelShapeState = {
    selected: boolean,
    inSelection: boolean,
    underCursor: boolean,
    highlighted: boolean,
    canBePlaced: boolean,
}

export type ShapeState = PanelShapeState