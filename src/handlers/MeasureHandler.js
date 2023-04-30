import { MouseHandler } from "./MouseHandler";
import Geometry from "../utils/geometry";
import MeasureShape from "../components/shapes/MeasureShape";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
export class MeasureHandler extends MouseHandler {
    constructor(state){
        super(state);
        this.first=true;
        this.setStatusBar()
        this.clickCount = 0
    }
    setStatusBar(){
        if(this.isMobile){
            this.statusBar = [{text: ` - ${this.captions.scale}`, icons: ["gest_zoom"]}]
             }
            else{
            this.statusBar = [{text: ` - ${this.captions.move}; `, icons: ["mmb"]},
                            {text: ` - ${this.captions.scale}`, icons: ["mmb_wheel"]},
                            {text: ` - ${this.captions.stopmeasure}`, icons: ["rmb", "button_esc"]}]
                        }
        this.statusBarHint = {text: `${this.captions.pick1}`}
    }
    keypress(code){
        return super.keypress(code)
    }
    move({curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        super.move({curPoint, viewPortData});
        let p = Geometry.screenToReal(curPoint.x, curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        const table = appData.tables.find(t => t.isPointInside(this.coord, true));
                let mindx = {dist: 10000}, mindy = {dist: 10000};
                if(!keys.ctrlKey){
                    for(let table of appData.tables){
                        const {dx, dy} = Geometry.minPointToRectDist(p, table.innerRect.model);
                        if(!isNaN(dx.dist) && mindx.dist > dx.dist) mindx = {...dx};
                        if(!isNaN(dy.dist) && mindy.dist > dy.dist) mindy = {...dy};
                    }
                    for(let panel of appData.panels){
                        const {dx, dy} = Geometry.minPointToRectDist(p, panel.outerRect.model);
                        if(!isNaN(dx.dist) && mindx.dist > dx.dist) mindx = {...dx};
                        if(!isNaN(dy.dist) && mindy.dist > dy.dist) mindy = {...dy};
                    }
                    if(mindx.dist < viewPortData.pixelRatio * viewPortData.snapMinDist) p.x = mindx.posX;
                    if(mindy.dist < viewPortData.pixelRatio * viewPortData.snapMinDist) p.y = mindy.posY;
                    
                }
            p.x = Math.trunc(p.x);
            p.y = Math.trunc(p.y);
            if(table === this.table){
                if(this.clickCount > 0){
                    const tl = {x: Math.min(this.firstPoint.x, p.x), y: Math.max(this.firstPoint.y, p.y)}
                    this.curShape.model.length = Math.trunc(Math.abs(this.firstPoint.x - p.x))
                    this.curShape.model.width = Math.trunc(Math.abs(this.firstPoint.y - p.y))
                    this.curShape.setPosition(tl)
                }
        }
        setViewPortData(prevData => setCurCoord(p, this.curPoint, prevData));
        this.lastPoint = {...this.coord};
        }
    down({button, appActions}){
        if(button === MouseHandler.MBUTTON_RIGHT) appActions.cancel();
        if(button === MouseHandler.MBUTTON_MIDDLE) appActions.setScreenStatus(Status.PAN, {startPoint: this.coord, prevStatus: Status.MEASURE, prevMouseHandler: this});
    }
    click({button, curPoint, viewPortData, appActions, appData}){
        super.click({button, curPoint, viewPortData})
        this.coord = {...viewPortData.curRealPoint}
        if(button === MeasureHandler.MBUTTON_RIGHT){appActions.cancel();return}
        if(button === MeasureHandler.MBUTTON_MIDDLE) return
        if(this.clickCount === 1){
            this.statusBarHint = {text: `${this.captions.pick2}`}
            const table = appData.tables.find(t => t.isPointInside(this.coord, true))
            if(table){
                this.table = table;
                this.curShape = new MeasureShape({length: 0, width: 0, margin: appData.panelMargin / 2})
                this.firstPoint = {x: Math.trunc(this.coord.x), y: Math.trunc(this.coord.y)};
            }
            else {
                this.clickCount = 0
                this.table = undefined
                this.statusBarHint = {text: `${this.captions.pick1}`}
            }
            
        }
        if(this.clickCount === 2){
            this.curShape = null
            this.clickCount = 0
            this.statusBarHint = {text: `${this.captions.pick1}`}
        }
        appActions.updateState();
    }

    touchDown({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        super.touchDown({pointerId, curPoint, viewPortData})
        const tm = viewPortData.touchManager
        if(tm.getTouchCount() === 1){
            this.clickCount = 0
            this.click({button: 0, curPoint, viewPortData, appActions, appData})

        }
    }
    touchMove({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        super.touchMove({pointerId, curPoint, viewPortData})
        const tm = viewPortData.touchManager
        if(tm.getTouchCount() === 1){
            this.move({curPoint, viewPortData, setViewPortData, appActions, appData, keys:{}})
        }
    }
    touchUp({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        super.touchUp({pointerId, viewPortData})
        const tm = viewPortData.touchManager
        if((tm.getTouchCount() === 0)&&curPoint) this.click({button: 0, curPoint, viewPortData, appActions, appData})
    }
}