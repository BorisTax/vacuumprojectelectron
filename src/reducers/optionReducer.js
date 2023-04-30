import { ModelActions } from "../actions/ModelActions";

export default function optionReducer(state, action){
    switch (action.type){

        case ModelActions.SET_DELETE_CONFIRM:
            return {result: true, newState: {...state, deleteConfirm: action.payload}}

        case ModelActions.SET_DRAW_MODULE:
            state.panels.forEach(p => { p.model.drawModule = action.payload; p.refreshModel() })
            return { result: true, newState: {...state, drawModuleInCaption: action.payload} }


        default: {
            return {result: false, newState: state}
        }
    }
}