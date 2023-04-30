import { MouseHandler } from "./MouseHandler";
import DragCursor from "../components/shapes/cursors/DragCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import { Status } from "../reducers/functions";
import { setCurCoord } from "../functions/viewPortFunctions";
import Geometry from "../utils/geometry";
export class StatusFreeHandler extends MouseHandler {
    constructor(state){
        super(state);
        this.setStatusBar()
    }
    setStatusBar(){
        if(this.isMobile)
                this.statusBar = [{text: ` - ${this.captions.move};  `, icons: ["gest_move"]},
                                {text: ` - ${this.captions.rotate};  `, icons: ["gest_dbltap"]},
                                {text: ` - ${this.captions.scale}  `, icons: ["gest_zoom"]}
                                ];
                else
                this.statusBar = [{text: ` - ${this.captions.move};  `, icons: ["rmb","mmb"]},
                {text: ` - ${this.captions.scale}  `, icons: ["mmb_wheel"]}
                ];   
    }
    move({curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        super.move({curPoint, viewPortData});
        if(this.drag){
            if(!keys.shiftKey) appData.panels.forEach(p => p.state.selected = false)
            this.activeShape.state.selected = true
            appActions.movePanel(this.activeShape, this.dragPos);
            return;
        }else{
            this.activeShape = null;
            for(let p of appData.panels){
                if(p.isPointInside(this.coord)) {
                    appActions.setCursor(new DragCursor(this.coord));
                    p.setState({highlighted: true})
                    this.activeShape = p;
                }else{
                    p.setState({highlighted: false})
                }
            }
            if(!this.activeShape) appActions.setCursor(new SelectCursor(this.coord));
            }
         setViewPortData(prevData => setCurCoord(this.coord, this.curPoint, prevData));
        if(this.startSelection) if(!appData.isMobile){appActions.startSelection(this.coord)}
    }

    down({button, curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        super.down({curPoint, viewPortData})
        
        setViewPortData(prevData => setCurCoord(this.coord, curPoint, prevData));
        if(button === 1 || button === 2){
            appActions.setScreenStatus(Status.PAN, {startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this});
            return
            }
        if(button !== 0)return
        this.activeShape = null;
        for(let p of appData.panels){
            if(p.isPointInside(this.coord)) {
                this.activeShape = p;
            }else{
                //if(!keys.shiftKey)p.setState({selected:false})
            }
        }
        this.drag = false;
        this.startSelection = true
        if(this.activeShape) {
            const dx = this.coord.x - this.activeShape.outerRect.model.topLeft.x;
            const dy = this.activeShape.outerRect.model.topLeft.y - this.coord.y;
            this.drag = true;
            this.dragPos = {dx, dy}
        }
            
    }
    click({button, curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        super.click({curPoint, viewPortData});
        if(button !== 0)return
        if(this.avoidClick === true){
            this.avoidClick = false
            return
        }
        let clickOnPanel = false;
        for(let p of appData.panels){
            if(p.isPointInside(this.coord)) {
                if(keys.shiftKey) p.setState({selected: !p.state.selected});else p.setState({selected: true})
                clickOnPanel = true
            }else{
                if(!keys.shiftKey) p.setState({selected: false})
            }
        }
        if(clickOnPanel) return appActions.updateState();
        let tableIndex = 0
        for(let t of appData.tables){
            if(t.isPointInside(this.coord)) {
                appActions.setActiveTable(tableIndex)
                break;
            }
            tableIndex++
        }
        appActions.updateState()
    }
    doubleClick({button, curPoint, viewPortData, setViewPortData, appActions, appData, keys}){
        super.doubleClick({curPoint, viewPortData})
        if(button === 0 && this.activeShape){
            if(appData.material.texture) return;
            for(let panel of appData.panels){
                panel.state.selected = (panel === this.activeShape)
            }
            appActions.flipOrientation()
            //this.movePoint.dx = (appData.curShape.model.length + appData.curShape.model.margin * 2) / 2
            //this.movePoint.dy = (appData.curShape.model.width + appData.curShape.model.margin * 2) / 2
            appActions.repaint()
            return true;
        }
    }
    keypress(code){
        return super.keypress(code)
    }
    up({appActions}){
        this.drag = false;
        this.startSelection = false;
        appActions.updateState()
    }
    getSelectedShapeProperties(state){
        this.properties = [];
        const shape = state.selectionManager.getSelectedPanels().pop();
        if(shape){
            const props = shape.getProperties();
            this.setProperties(props);
            this.currentObject = shape;
        }
    }

    touchDown({pointerId, curPoint, viewPortData, setViewPortData, appActions, appData}){
        super.touchDown({pointerId, curPoint, viewPortData})
        this.down({button: 0, curPoint, viewPortData, setViewPortData, appActions, appData})
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
            if(this.drag){
                appData.panels.forEach(p => p.state.selected = false)
                this.activeShape.state.selected = true
                appActions.movePanel(this.activeShape, this.dragPos);
                return;
            }
            appActions.setScreenStatus(Status.PAN, {startPoint: this.coord, prevStatus: Status.FREE, prevMouseHandler: this})
        }
    }
}