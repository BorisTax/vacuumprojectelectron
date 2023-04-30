import { ModelActions } from "../actions/ModelActions";
import { setMaterial } from "./functions";
import { checkAllPanelsOnIntersection } from "./panels";

export default function materialReducer(state, action){
    switch (action.type){

        case ModelActions.SET_MATERIAL_TEXTURE_CONFIRM:
            return { result: true, newState: {...state, 
                showConfirm: { show: true, 
                    messageKey: "changeTexture", 
                    actions: [{ caption: "Да", onClick: () => { state.panels.forEach(p => { if (!p.model.vertical) p.flipOrientation() }); return ModelActions.setMaterial({ ...action.payload, force: true }) } }, 
                            { caption: "Нет", onClick: () => ModelActions.setMaterial({ ...action.payload, force: true }) 
                        }]}}}

        case ModelActions.SET_MATERIAL:
            if (!action.payload.force && action.payload.texture && state.panels.some(p => p.model.vertical === false)) return { result: true, newState: {...state, showConfirm: { show: true, messageKey: "changeTexture", actions: [{ caption: "Да", onClick: () => { state.panels.forEach(p => { if (!p.model.vertical) p.flipOrientation() }); return ModelActions.setMaterial({ ...action.payload, force: true }) } }, { caption: "Нет", onClick: () => ModelActions.setMaterial({ ...action.payload, force: true }) }] }} }
            const newState = setMaterial(state, action.payload)
            checkAllPanelsOnIntersection(newState);
            return {result: true, newState}

        default: {
            return {result: false, newState: state}
        }
    }
}