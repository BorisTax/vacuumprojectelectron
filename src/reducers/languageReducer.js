import { AppActions } from "../actions/AppActions";

export default function languageReducer(state, action){
    switch (action.type){
        case AppActions.SET_LANGUAGE:
            document.title = action.payload.title;
            state.tables.forEach(table => {
                table.setCaptions(action.payload.print)
            });
            state.mouseHandler.setCaptions(action.payload.toolbars.statusbar)
            state.tables.forEach(t => { t.setPanelList(state.panels) });
            return { result: true, newState: {...state, captions: action.payload} };

        default: {
            return {result: false, newState: state}
        }
    }
}