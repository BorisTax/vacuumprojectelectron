import SelectCursor from "../components/shapes/cursors/SelectCursor";
import TableLayoutShape from "../components/shapes/TableLayoutShape";
import { captions } from '../locale/ru.js';
import { getNewDate, isMobile, Status } from "./functions";

export function getInitialState(){
    return {cursor: new SelectCursor({ x: 0, y: 0 }),
    curShape: null,
    prevStatus: Status.FREE,
    tableMarginLength: 120,
    tableMarginWidth: 100,
    panelMargin: 100,
    panels: [],
    selectedPanels: [],
    activeTable: 0,
    goToActiveTable: 0,
    tables: [new TableLayoutShape({ id: 0, type: TableLayoutShape.BIG,  multiply: 1, marginLength: 70, marginWidth: 50, topLeft: { x: 0, y: 0 } }, captions.print)],
    detailList: {
        primary: [
            { id: 1, listKey: "primary", module: "", name: "Фасад", length: 717, width: 297, count: 6, margin: 50, placed: 0, created: 0},
            { id: 2, listKey: "primary", module: "", name: "Фасад", length: 917, width: 197, count: 5, margin: 50, placed: 0, created: 0 },
            { id: 3, listKey: "primary", module: "", name: "Фасад", length: 110, width: 597, count: 3, margin: 50, placed: 0, created: 0 },
            { id: 4, listKey: "primary", module: "", name: "Фасад", length: 750, width: 500, count: 3, margin: 50, placed: 0, created: 0}
        ],
        secondary: []
    },
    deleteConfirm: true,
    information: { order: "", plan: "", currentDate: getNewDate() },
    material: { name: "", gloss: true, texture: false },
    detailMargin: 50,
    drawModuleInCaption: true,
    showLoading: false,
    showConfirm: { show: false, message: "" },
    showAlert: { show: false, message: "" },
    snapDist: 20, snapMinDist: 10,
    status: Status.FREE,
    statusBar: 5,
    statusParams: { creator: null, picker: null },
    isMobile: isMobile(),
    captions}
}