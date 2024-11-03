import { ModelActions } from "../actions/ModelActions";
import { checkAllPanelsOnIntersection } from "./panels";

export default function optionReducer(state, action){
    let newState
    switch (action.type){

        case ModelActions.SET_DELETE_CONFIRM:
            return {result: true, newState: {...state, settings: {...state.settings, deleteConfirm: action.payload}}}

        case ModelActions.SET_ALLPLACEDFORCE:
            newState = {...state, settings: {...state.settings, allPlacedForce: action.payload}}
            checkAllPanelsOnIntersection(newState)
            return {result: true, newState}

        case ModelActions.SET_DRAW_MODULE:
            state.panels.forEach(p => { p.model.drawModule = action.payload; p.refreshModel() })
            return { result: true, newState: {...state, settings:  {...state.settings, drawModuleInCaption: action.payload} }}


        default: {
            return {result: false, newState: state}
        }
    }
}