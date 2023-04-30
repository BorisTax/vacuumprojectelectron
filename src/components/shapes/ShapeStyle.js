import { Color } from "../colors";

export default class ShapeStyle {
    static DASH=[1,3];
    static SOLID=[0];
    static SELECTION=[1,3];
    static ACTIVE_SHAPE=new ShapeStyle(Color.BLACK,ShapeStyle.SOLID,2);
    static INACTIVE_SHAPE=new ShapeStyle(Color.BLACK,ShapeStyle.SOLID,1);
    static MockShape=new ShapeStyle(Color.DARK_GRAY,ShapeStyle.SOLID);
    static GRID_STYLE_DASH = new ShapeStyle(Color.GRAY, ShapeStyle.DASH);
    static GRID_STYLE_SOLID = new ShapeStyle(Color.GRAY, ShapeStyle.SOLID);
    constructor(color=Color.BLACK,stroke=ShapeStyle.SOLID,width=1){
        this.color=color;
        this.originColor=this.color;
        this.width=width;
        this.stroke=stroke;

    }
    getDefault(){
        return new ShapeStyle(Color.BLACK,ShapeStyle.SOLID);
    }
    getColor() {
        return this.color;
    }

    setColor(color) {
        this.color = color;
    }
    getType(){return this.type;}
    getStroke() {
        return this.stroke;
    }

    setStroke(stroke) {
        this.stroke = stroke;
    }
    getWidth(){
        return this.width;
    }
    setWidth(width){
        this.width=width;
    }

}