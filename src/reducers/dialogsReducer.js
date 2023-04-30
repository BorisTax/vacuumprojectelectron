import { AppActions } from "../actions/AppActions";

export default function dialogsReducer(state, action){
    switch (action.type){
        case AppActions.SHOW_ALERT:
            return { result: true, newState: {...state, showAlert: action.payload} };

        case AppActions.SHOW_CONFIRM:
            return { result: true, newState: {...state, showConfirm: action.payload} };

        case AppActions.SHOW_HELP:
                return { result: true, newState: {...state, showHelp: action.payload} };

        default: {
            return {result: false, newState: state}
        }
    }
}