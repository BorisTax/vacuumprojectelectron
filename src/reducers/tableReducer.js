import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import TableLayoutShape from "../components/shapes/TableLayoutShape";
import { checkAllPanelsOnIntersection, updatePlacedDetails } from "./panels";

export default function tableReducer(state, action){
    switch (action.type){
        case ModelActions.ADD_TABLE:
            const y = state.tables[state.tables.length - 1].model.topLeft.y - 2000;
            let id = 0;
            // eslint-disable-next-line
            while (state.tables.some(t => t.getId() === id)) id++;
            const table = new TableLayoutShape({ id, multiply: 1, type: TableLayoutShape.SMALL, marginLength: state.tableMarginLength - state.panelMargin / 2, marginWidth: state.tableMarginWidth - state.panelMargin / 2, topLeft: { x: 0, y: y }}, state.captions.print)
            state.tables.push(table)
            return { result: true, newState: {...state} };

        case ModelActions.DELETE_ACTIVE_TABLE:
            if (state.tables.length < 2) return { ...state }
            state.panels = state.panels.filter(p => {
                const panelNotOnTable = p.getTableId() !== state.tables[state.activeTable].getId()
                if (!panelNotOnTable) state.detailList[p.model.listKey].forEach(d => { if (p.getId() === d.id) d.created--; })
                return panelNotOnTable;
            })
            if (state.activeTable < (state.tables.length - 1))
                for (let tableIndex = state.activeTable + 1; tableIndex < state.tables.length; tableIndex++) {
                    const table = state.tables[tableIndex]
                    table.setTopLeft({ x: table.model.topLeft.x, y: table.model.topLeft.y + 2000 });
                    state.panels.forEach(p => {
                        const pos = p.getPosition();
                        if (p.getTableId() === table.getId()) p.setPosition({ x: pos.x, y: pos.y + 2000 })
                    })
                }
            state.tables = state.tables.filter((t, i) => i !== state.activeTable);
            if (state.activeTable > 0) state.activeTable--;
            updatePlacedDetails(state);
            return { resukt: true, newState: {...state, detailList: { ...state.detailList }} }

        case ModelActions.DELETE_TABLE_CONFIRM:
            const showConfirm = { show: true, messageKey: "deleteTable", actions: [{ caption: "OK", onClick: ModelActions.deleteActiveTable }] }
            return { result: true, newState: {...state, showConfirm} }

        case ScreenActions.GO_TO_ACTIVE_TABLE:
            return {result: true,
                newState: {...state, goToActiveTable: (state.goToActiveTable + 1) % 2}
            }

        case ModelActions.SET_ACTIVE_TABLE:
            return { result: true, newState: {...state, activeTable: action.payload} }

        case ModelActions.SET_COMPLECT_COUNT:
            state.tables[state.activeTable].model.multiply = action.payload
            checkAllPanelsOnIntersection(state)
            updatePlacedDetails(state);
            return { result: true, newState: {...state} }

        case ModelActions.SET_TABLE_TYPE:
            state.tables[state.activeTable].setType(action.payload)
            checkAllPanelsOnIntersection(state)
            updatePlacedDetails(state);
            return { result: true, newState: {...state} }

        default: {
            return {result: false, newState: state}
        }
    }
}