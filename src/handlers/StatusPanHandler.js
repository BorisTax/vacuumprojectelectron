import Geometry from "../utils/geometry";
import { MouseHandler } from "./MouseHandler";
import { getRealRect, getScreenRect, setCurCoord, setTopLeft } from "../functions/viewPortFunctions";
export class StatusPanHandler extends MouseHandler {
    constructor(params) {
        super(params.state);
        this.startPoint = params.startPoint;
        this.setStatusBar()
    }
    setStatusBar(){
        this.statusBar = []
    }
    move({ curPoint, viewPortData, setViewPortData, appData }) {
        super.move({ curPoint, viewPortData });
        let dx = this.coord.x - this.startPoint.x;
        let dy = this.coord.y - this.startPoint.y;
        const realRect = getRealRect(viewPortData.topLeft, viewPortData.bottomRight)
        const screenRect = getScreenRect(viewPortData.viewPortWidth, viewPortData.viewPortHeight)
        const screenTopLeft = Geometry.realToScreen({ x: dx, y: dy }, realRect, screenRect);
        const screenBottomRight = Geometry.realToScreen({ x: 3500 + dx, y: dy - appData.tables.length * 2000 }, realRect, screenRect);
        const topLeft = { x: 0, y: 0 }
        const xInRange = (screenTopLeft.x <= viewPortData.viewPortWidth / 2) && (screenBottomRight.x >= viewPortData.viewPortWidth / 2);
        const yInRange = (screenTopLeft.y <= viewPortData.viewPortHeight / 2) && (screenBottomRight.y >= viewPortData.viewPortHeight / 2);
        topLeft.x = xInRange ? viewPortData.topLeft.x - dx : viewPortData.topLeft.x;
        topLeft.y = yInRange ? viewPortData.topLeft.y - dy : viewPortData.topLeft.y;
        setViewPortData(prevData => setTopLeft(topLeft, prevData))
        const cursorPoint = { x: xInRange ? this.startPoint.x : this.coord.x, y: yInRange ? this.startPoint.y : this.coord.y }
        setViewPortData(prevData => setCurCoord(cursorPoint, curPoint, prevData))

    }
    up({ button, appActions }) {
        if (button === 1 || button === 2) appActions.setPrevStatus();
    }
    wheel() {

    }
    keypress(code) {
        return super.keypress(code)
    }
    leave({ appActions }) {
        super.leave();
        appActions.setPrevStatus();
    }
    touchUp({pointerId, appActions, viewPortData}) {
        super.touchUp({pointerId, viewPortData})
        appActions.setPrevStatus();
    }
    touchMove({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        this.move({curPoint, viewPortData, setViewPortData, appActions, appData})
    }

}
