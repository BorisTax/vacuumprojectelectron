import Geometry from "../utils/geometry";
import { scale } from "../functions/viewPortFunctions";
export class MouseHandler {
    static MBUTTON_LEFT = 0
    static MBUTTON_MIDDLE = 1
    static MBUTTON_RIGHT = 2
    constructor(state){
        this.isMobile = state.isMobile
        this.clickCount = 0;
        this.curShape = null;
        this.coord = {x: 0, y: 0}
        this.prevCoord = this.coord
        this.statusBar = [];
        this.properties = [];
        this.captions = (state||state.captions)?state.captions.toolbars.statusbar:{}

    }
    setCaptions(captions){
        this.captions = captions
        this.setStatusBar()
    }
    keypress(code){
        if(code === "Space"){
            return true;
        }
    }
    click({button, curPoint, viewPortData}){
        this.clickCount++;
        this.coord = Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        this.prevCoord = this.coord
    }
    doubleClick({button, curPoint, viewPortData}){
        this.coord = Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
    }
    isOutRect(p, viewPortData){
        return p.x < viewPortData.marginLeft || p.x > viewPortData.viewPortWidth - viewPortData.marginRight
         ||p.y < viewPortData.marginTop || p.y > viewPortData.viewPortHeight - viewPortData.marginBottom;
     }
     move({curPoint, viewPortData}){
        this.prevPoint={...this.curPoint}
        this.curPoint={...curPoint}
        this.coord = Geometry.screenToReal(this.curPoint.x, this.curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        this.coord.x = Math.trunc(this.coord.x);
        this.coord.y = Math.trunc(this.coord.y);
        this.mouseOnScreen = !this.isOutRect(this.curPoint, viewPortData);
        if(!this.mouseOnScreen){
            this.curPoint.x=this.prevPoint.x;
            this.curPoint.y=this.prevPoint.y;
        }
     }
     mouseOnScreen(viewPortData){
         return !this.isOutRect(this.curPoint, viewPortData);
     }
     down({curPoint, viewPortData}){
        this.coord=Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
     }
     up(){}
     leave(){
         this.mouseOnScreen = false;
     }
     wheel({deltaY, curPoint, viewPortData, setViewPortData, appActions, keys}){
        let point = Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        if((deltaY > 0) && (viewPortData.realWidth <= 9000)) setViewPortData(prevData => scale(1.2, point, prevData))
        if((deltaY < 0) && (viewPortData.pixelRatio >= 0.001)) setViewPortData(prevData => scale(1/1.2, point, prevData));
     }
     touchDown({pointerId, curPoint, viewPortData}){
        viewPortData.touchManager.addTouchEvent({pointerId, curPoint})
        //this.touchEvents.push({pointerId, curPoint})

     }
     touchMove({pointerId, curPoint, viewPortData}){
        viewPortData.touchManager.setPoint(pointerId, curPoint)
        this.curPoint = {...curPoint}
        this.coord = Geometry.screenToReal(this.curPoint.x, this.curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);

     }
     touchUp({pointerId, viewPortData}){
        viewPortData.touchManager.removeTouchEvent(pointerId)

     }
    }