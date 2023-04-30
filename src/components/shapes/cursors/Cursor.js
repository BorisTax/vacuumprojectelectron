import Shape from "../Shape";
import Geometry from "../../../utils/geometry";

export default class Cursor extends Shape{
    constructor(point){
        super();
        this.p=point;
    }

    refresh(realRect,  screenRect){
        this.p0 = Geometry.realToScreen(this.p,realRect,screenRect);
    }
    setPosition(point) {
        this.p=point;
    }
    setAdditional({shiftKey,altKey}){
        this.shiftKey=shiftKey;
        this.altKey=altKey;
    }
}
