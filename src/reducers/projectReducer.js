import { ModelActions } from "../actions/ModelActions";
import { ScreenActions } from "../actions/ScreenActions";
import PanelShape from "../components/shapes/PanelShape";
import TableLayoutShape from "../components/shapes/TableLayoutShape";
import { StatusFreeHandler } from "../handlers/StatusFreeHandler";
import { getNewDate } from "./functions";
import { getInitialState } from "./initialState";
import { checkAllPanelsOnIntersection } from "./panels";
import { printToPDF } from "./printPdf";

export default function projectReducer(state, action){
    switch (action.type){
        case ModelActions.NEW_PROJECT_CONFIRM:
            const showConfirm = { show: true, messageKey: "newProject", actions: [{ caption: "OK", onClick: () => ModelActions.newProject() }] }
            return {result: true, newState: {...state, showConfirm}};

        case ModelActions.NEW_PROJECT:
            const initialState = getInitialState()
            initialState.mouseHandler = new StatusFreeHandler(initialState)
            return {result: true, 
                newState: {...state,
                detailList: initialState.detailList,
                tables: initialState.tables,
                panels: initialState.panels,
                activeTable: initialState.activeTable,
                information: initialState.information}
            };
        case ScreenActions.PRINT:
            printToPDF(state, action.payload)
            return {result: true,
                newState: state,
            }

        case ModelActions.SET_INFORMATION:
            return { result: true, newState: {...state, information: { ...action.payload }} }

        case ModelActions.SAVE_PROJECT:
            saveCurrentState(state);
            return {result: true, newState: state};

        case ModelActions.SET_PROJECT:
            const project = action.payload;
            if (!project.project) return { result: true, newState: {...state, showAlert: { show: true, message: state.captions.messages.corruptedProject}} }
            const newState = loadCurrentState(project.state, state);
            return { result: true, newState: {...state, ...newState} };

        default: {
            return {result: false, newState: state}
        }
    }
}


export function saveCurrentState(state) {
    const saveState = {
        tableMarginLength: state.tableMarginLength,
        tableMarginWidth: state.tableMarginWidth,
        panelMargin: state.panelMargin,
        panels: state.panels.map(p => p.model),
        activeTable: state.activeTable,
        tables: state.tables.map(t => t.model),
        detailList: {
            primary: state.detailList["primary"],
            secondary: state.detailList["secondary"]
        },
        deleteConfirm: state.deleteConfirm,
        allPlacedForce: state.allPlacedForce,
        information: { ...state.information },
        material: { ...state.material },
        drawModuleInCaption: state.drawModuleInCaption
    };
    const project = { project: 1.0, state: saveState }
    var contents = JSON.stringify(project);
    var link = document.createElement('a');
    link.setAttribute('download', "project.json");
    link.href = makeTextFile(contents);
    link.click()
}

export function loadCurrentState(state, oldState) {
    const panels = state.panels.map(p => { const panel = new PanelShape({ ...p, drawModule: state.drawModuleInCaption }); panel.state.selected = false; panel.refreshModel(); return panel });
    const newState = {
        tableMarginLength: state.tableMarginLength,
        tableMarginWidth: state.tableMarginWidth,
        panelMargin: state.panelMargin,
        panels: panels,
        deleteConfirm: state.deleteConfirm,
        allPlacedForce: state.allPlacedForce,
        activeTable: state.activeTable,
        tables: state.tables.map(t => {
            const table = new TableLayoutShape({...t}, oldState.captions.print);
            table.setPanelList(panels);
            return table;
        }),
        detailList: {
            primary: state.detailList["primary"],
            secondary: state.detailList["secondary"]
        },
        information: { ...state.information, currentDate: state.information.currentDate|| getNewDate() },
        material: { ...state.material },
        drawModuleInCaption: state.drawModuleInCaption
    };
    checkAllPanelsOnIntersection(newState);
    return newState;
}

var textFile = null
var makeTextFile = function (text) {
    var data = new Blob([text], { type: 'application/json' });
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
};