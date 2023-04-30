import { ScreenActions } from "../actions/ScreenActions";
import { ShapeActions } from "../actions/ShapeActions";
import DragCursor from "../components/shapes/cursors/DragCursor";
import SelectCursor from "../components/shapes/cursors/SelectCursor";
import PanelShape from "../components/shapes/PanelShape"
import { PanelPlaceHandler } from "../handlers/PanelPlaceHandler";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { Status } from "./functions";
import { checkAllPanelsOnIntersection, updatePlacedDetails } from "./panels";

export default function panelReducer(state, action){
    switch (action.type){
        case ScreenActions.ADD_PANEL:
            const panel = action.payload
            for (const det of state.detailList[panel.model.listKey]) if (panel.getId() === det.id) det.created++;
            state.panels.push(panel);
            state.tables.forEach(t => { t.setPanelList(state.panels) });
            return { result: true, newState: {...state, status: Status.FREE} };

        case ScreenActions.ARRANGE_PANELS:
            const { hor, vert } = action.payload
            const activeTable = state.tables[state.activeTable]
            const tableId = activeTable.getId();
            const marginLength = activeTable.model.marginLength
            const marginWidth = activeTable.model.marginWidth
            const maxY = -state.tables.length * 2000;
            const leftX = state.panels.filter(p => p.getTableId() === tableId).reduce((a, p) => Math.min(p.outerRect.model.topLeft.x, a), 2700);
            const rightX = state.panels.filter(p => p.getTableId() === tableId).reduce((a, p) => Math.max(p.outerRect.model.bottomRight.x, a), 0);
            const topY = state.panels.filter(p => p.getTableId() === tableId).reduce((a, p) => Math.max(p.outerRect.model.topLeft.y, a), maxY);
            const bottomY = state.panels.filter(p => p.getTableId() === tableId).reduce((a, p) => Math.min(p.outerRect.model.bottomRight.y, a), 0);
            const topMargin = Math.abs(topY - activeTable.innerRect.model.topLeft.y)
            const leftMargin = (leftX - activeTable.innerRect.model.topLeft.x)
            var dx = leftMargin - Math.trunc((activeTable.model.length  - marginLength * 2 - rightX + leftX) / 2)
            var dy = topMargin - Math.trunc((activeTable.model.width - marginWidth * 2 - (topY - bottomY)) / 2)
            state.panels.filter(p => p.getTableId() === tableId).forEach(p => {
                const pos = p.getPosition();
                if (hor) pos.x -= dx;
                if (vert) pos.y += dy;
                p.setPosition(pos)
            })
            return { result: true, newState: {...state} }

        case ShapeActions.CREATE_PANEL:
            state.panels.forEach(p => { p.state.selected = false })
            var newState = {
                ...state, curShape: new PanelShape({ ...action.payload, drawModule: state.drawModuleInCaption}),
                cursor: new DragCursor(state.curRealPoint), status: Status.CREATE
            }
            newState.tables.forEach(t => { t.setPanelList(newState.panels) });
            return { result: true, newState: {...newState, mouseHandler: new PanelPlaceHandler(newState, true)} };

        case ScreenActions.DELETE_CONFIRM:
            var showConfirm = (state.panels.some(s => s.state.selected)) ? { show: true, messageKey: "deletePanels", actions: [{ caption: "OK", onClick: ScreenActions.deleteSelectedPanels }] } : {show: false}
            return { result: true, newState: {...state, showConfirm}}



        case ShapeActions.DELETE_PATH:
            var detail = state.detailList[action.payload.listKey].find(d => (d.id === action.payload.detailId))
            if(!detail) {
                return {result: true, newState: {...state}}
            }
            detail.innerMattePath = ""
            detail.innerGlossPath = ""
            detail.outerMattePath = ""
            detail.outerGlossPath = ""
            state.panels.forEach(p => {if((detail.id === p.getId() && action.payload.listKey === p.model.listKey)){
                p.deletePath()
            }
            })
            return {result: true, newState: {...state}}

        case ShapeActions.DELETE_PATH_CONFIRM:
             showConfirm = { show: true, messageKey: "deletePath", actions: [{ caption: "OK", onClick: () => ShapeActions.deletePath(action.payload.listKey, action.payload.detailId) }] }
            return { result: true, newState: {...state, showConfirm}}

        case ScreenActions.DELETE_SELECTED_PANELS:
            const panels = state.panels.filter((p) => {
                if (p.state.selected) state.detailList[p.model.listKey].forEach(d => { if (p.getId() === d.id) d.created--; })
                return !p.getState().selected;
            });
            newState = {
                ...state,
                panels,
                selectedPanels: [],
                mouseHandler: new StatusFreeHandler(state),
                cursor: new SelectCursor()
            };
            updatePlacedDetails(newState);
            newState.tables.forEach(t => { t.setPanelList(newState.panels) });
            return { result: true, newState: {...newState, detailList: { ...newState.detailList }} };

        case ScreenActions.FLIP_ORIENTATION:
            if (state.curShape)
                state.curShape.flipOrientation()
            else
                state.panels.forEach(p => { if (p.state.selected) p.flipOrientation() });
            checkAllPanelsOnIntersection(state);
            return { result: true, newState: {...state} }

        case ShapeActions.MOVE_PANEL:
            newState = {
                ...state, curShape: action.payload.panel,
                cursor: new DragCursor(state.curRealPoint),
            }
            return {result: true, 
                newState: {...newState,
                mouseHandler: new PanelPlaceHandler(newState, false, action.payload.movePoint)}
            };

        case ScreenActions.SELECT_ALL:
            var selectedPanels = [];
            state.panels.forEach((s, i) => {
                if (i > 1) {
                    s.setState({ selected: true });
                    selectedPanels.push(s);
                }
            });
            return { result: true, newState: {...state, selectedPanels} };
            
        case ScreenActions.SELECT_PANEL:
            return { result: true, newState: {...state, selectedPanels: action.payload} };

        case ShapeActions.SET_PATH:
            const path = action.payload.path
            detail = state.detailList[action.payload.listKey].find(d => (d.id === action.payload.detailId) && (d.length === path.length) && (d.width === path.width))
            if(!detail) {
                return {result: true, newState: {...state, showAlert: {show: true, message: state.captions.messages.wrongPath}}}
            }
            detail.innerMattePath = path.innerMattePath
            detail.innerGlossPath = path.innerGlossPath
            detail.outerMattePath = path.outerMattePath
            detail.outerGlossPath = path.outerGlossPath
            state.panels.forEach(p => {if((detail.id === p.getId() && action.payload.listKey === p.model.listKey)){
                p.setPath(path)
            }
            })
            return { result: true, newState: {...state} };

        default: {
            return {result: false, newState: state}
        }
    }
}