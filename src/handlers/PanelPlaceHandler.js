import { MouseHandler } from "./MouseHandler";
import { PropertyTypes } from "../components/shapes/PropertyData";
import Geometry from "../utils/geometry";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
export class PanelPlaceHandler extends MouseHandler {
    constructor(state, newPanel, movePoint){
        super(state);
        this.movePoint=movePoint;
        this.properties=[
            {type:PropertyTypes.BOOL,value:false,labelKey:"make_copy",setValue:(value)=>{this.makeCopy=value;}},
        ]
        if(!this.movePoint){
            this.movePoint={}
            this.movePoint.dx = (state.curShape.model.length + state.curShape.model.margin * 2) / 2
            this.movePoint.dy = (state.curShape.model.width + state.curShape.model.margin * 2) / 2
        }
        this.panels = state.panels
        this.activeShape = state.curShape
        this.newPanel = newPanel;
        if(this.newPanel) this.panels = [...state.panels,state.curShape];
        this.curShape = state.curShape; 
        this.countSelected = this.panels.filter(p => p.state.selected).length
        this.first = true;
        this.setStatusBar()
    }
    setStatusBar(){
        if(this.isMobile)
            this.statusBar=[{text:` - ${this.captions.scale}  `, icons: ["gest_zoom"]}];
            else
            this.statusBar=[{text:` - ${this.captions.rotate};  `, icons:["rmb"]}, 
                            {text:` - ${this.captions.move};  `, icons:["mmb"]},
                            {text:` - ${this.captions.scale};  `, icons:["mmb_wheel"]},
                            {text:` - ${this.captions.snap}`, icons:["button_ctrl"]}]
    }
    keypress(code){
        return super.keypress(code)
    }
    down({button, appActions, appData}){
        if(button === 1){
            appActions.setScreenStatus(Status.PAN, {startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this});
            return
            }
        if(button === 2 && this.countSelected<2){
            if(appData.material.texture) return;
            appActions.flipOrientation()
            this.movePoint.dx = (appData.curShape.model.length + appData.curShape.model.margin * 2) / 2
            this.movePoint.dy = (appData.curShape.model.width + appData.curShape.model.margin * 2) / 2
            appActions.updateState()
            return true;
        }
    }
    move({curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        if(!keys) keys = {}
        super.move({curPoint, viewPortData});
        setViewPortData(prevData => setCurCoord(this.coord,this.curPoint, prevData))
        let curShape = appData.curShape;
        let p = Geometry.screenToReal(curPoint.x,curPoint.y, viewPortData.viewPortWidth, viewPortData.viewPortHeight, viewPortData.topLeft, viewPortData.bottomRight);
        p.x = p.x - this.movePoint.dx;
        p.y = p.y + this.movePoint.dy;
            let mindx = {dist: 10000}, mindy = {dist: 10000};
            const outerWidth = curShape.model.length + curShape.model.margin * 2
            const outerHeight = curShape.model.width + curShape.model.margin * 2
            if(!keys.ctrlKey){
                const curRect = {topLeft: p, bottomRight: {x: p.x + outerWidth, y: p.y - outerHeight}}
                for(let table of appData.tables){
                    const {dx, dy} = Geometry.minRectDist(curRect, table.innerRect.model, false);
                    if(!isNaN(dx.dist) && Math.abs(mindx.dist) > Math.abs(dx.dist)) mindx = {...dx};
                    if(!isNaN(dy.dist) && Math.abs(mindy.dist) > Math.abs(dy.dist)) mindy = {...dy};
                }
                for(let panel of this.panels){
                    if(panel.state.selected) continue;
                    const {dx, dy} = Geometry.minRectDist(curRect, panel.outerRect.model);
                    if(!isNaN(dx.dist) && Math.abs(mindx.dist) > Math.abs(dx.dist)) mindx = {...dx};
                    if(!isNaN(dy.dist) && Math.abs(mindy.dist) > Math.abs(dy.dist)) mindy = {...dy};
                }
                mindx.pos = mindx.front ? mindx.pos : mindx.pos - curShape.outerRect.model.width;
                mindy.pos = mindy.front ? mindy.pos : mindy.pos + curShape.outerRect.model.height;
                if(Math.abs(mindx.dist) < viewPortData.pixelRatio * viewPortData.snapMinDist) p.x = mindx.pos;
                if(Math.abs(mindy.dist) < viewPortData.pixelRatio * viewPortData.snapMinDist) p.y = mindy.pos;
                
            }
        p.x = Math.trunc(p.x);
        p.y = Math.trunc(p.y);
        var {x, y} = this.activeShape.getPosition();
        var [dx, dy] = [p.x - x, p.y - y];
        let selectedPanels = []
        for(const curShape of this.panels){
            if(!curShape.state.selected) continue;
            selectedPanels.push(curShape);
            ({x, y} = curShape.getPosition());
            curShape.setPosition({x: x + dx, y: y + dy});
        }
        appActions.updatePlacedDetails()
        this.lastPoint = {...this.coord};
        }

    up({button, curPoint, viewPortData, appActions, appData}){
        super.click({button, curPoint, viewPortData})
        if(button !== 0)return
        if(this.newPanel) {
            appData.curShape.state.selected = false;
            appActions.addShape(appData.curShape)
        }
        this.drag = false;
        appActions.updatePlacedDetails()
        appActions.cancelMoving();
    }

    touchMove({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        super.touchMove({pointerId, curPoint, viewPortData})
        const tm = viewPortData.touchManager
        if(tm.getTouchCount() > 1){
            const diff = Geometry.distance(tm.touches[0].curPoint, tm.touches[1].curPoint)
            const midPoint = Geometry.midPoint(tm.touches[0].curPoint, tm.touches[1].curPoint)
            const delta = tm.prevDiff - diff
            if (Math.abs(delta) > 10){
                const deltaY = Math.sign(delta)
                this.wheel({deltaY, curPoint: midPoint, viewPortData, setViewPortData})
                tm.prevDiff = diff
            }
        }
        if(tm.getTouchCount() === 1){
            this.move({curPoint, viewPortData, setViewPortData, appActions, appData})
        }
    }
    touchUp({pointerId, curPoint, viewPortData, appActions, appData}){
        super.touchUp({pointerId, viewPortData})
        const tm = viewPortData.touchManager
        if(tm.getTouchCount() === 0) this.up({button: 0, curPoint, viewPortData, appActions, appData})
     }
    click(){

        
    }
}