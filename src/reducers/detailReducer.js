import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import { setMaterial } from "./functions";
import { checkAllPanelsOnIntersection, updateDetailList, updatePlacedDetails } from "./panels";

export default function detailReducer(state, action){
    switch (action.type){
        case ModelActions.ADD_DETAIL:
            state.detailList = { ...state.detailList }
            let newId = 1
            // eslint-disable-next-line
            while (state.detailList[action.payload.listKey].some(detail => detail.id === newId)) newId++;
            state.detailList[action.payload.listKey].push({ id: newId, listKey: action.payload.listKey, name: "", length: 717, width: 297, count: 1, placed: 0, created: 0, margin: state.panelMargin / 2 });
            return { result: true, newState: {...state} };

        case ModelActions.DELETE_ROW_CONFIRM:
            const showConfirm = { show: true, messageKey: "deleteRow", actions: [{ caption: "OK", onClick: () => ModelActions.deleteRow(action.payload.listKey, action.payload.param.id) }] }
            return { result: true, newState: {...state, showConfirm} }

        case ModelActions.DELETE_ROW:
            state.detailList[action.payload.listKey] = state.detailList[action.payload.listKey].filter(detail => detail.id !== action.payload.id)
            const panels = state.panels.filter(panel => panel.getId() !== action.payload.id || panel.model.listKey !== action.payload.listKey)
            state.detailList[action.payload.listKey].forEach((detail, i) => {
                const index = i + 1
                if (detail.id !== index) {
                    panels.forEach(panel => { if (panel.getId() === detail.id) panel.setId(index) })
                    detail.id = index
                }
            })
            checkAllPanelsOnIntersection(state);
            updatePlacedDetails(state);
            return {result: true, newState: {...state, panels}}

        case ModelActions.SET_DETAIL_LIST:
            if (action.payload.data.error) return { ...state, showAlert: { show: true, message: "corruptedDetailList" } }
            const info = action.payload.data.info
            const list = action.payload.data.list
            const listKey = action.payload.listKey
            const newState = setMaterial(state, info.material);
            newState.detailList[listKey] = list.map(i => { return { listKey: listKey, margin: newState.panelMargin / 2, ...i } })
            const dList = { primary: newState.detailList["primary"], secondary: newState.detailList["secondary"] }
            newState.detailList = dList
            newState.information.order = info.order;
            newState.information.plan = info.plan;
            newState.material = info.material;
            newState.panels = [];
            return {result: true, newState};

        case ModelActions.SET_DETAIL_PROPERTY:
            state.detailList[action.payload.listKey][action.payload.index][action.payload.key] = action.payload.value
            updateDetailList(state)
            checkAllPanelsOnIntersection(state);
            state.tables.forEach(t => { t.setPanelList(state.panels) });
            return { result: true, newState: {...state} };

        case ScreenActions.UPDATE_PLACED_DETAILS:
            checkAllPanelsOnIntersection(state);
            updatePlacedDetails(state);
            return { result: true, newState: {...state, detailList: { ...state.detailList }} }

        default: {
            return {result: false, newState: state}
        }
    }
}