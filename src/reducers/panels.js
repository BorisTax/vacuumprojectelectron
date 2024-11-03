import Geometry from "../utils/geometry"
import { Status } from "./functions"

export function updateDetailList(state) {
    const removeList = new Set()
    for (const panel of state.panels) {
        let lonelyPanel = 0
        for (const listKey of ["primary", "secondary"]) {
            let index = 1
            for (const detail of state.detailList[listKey]) {
                if (panel.getId() === detail.id && panel.model.listKey === listKey) {
                    panel.model.origLength = detail.length
                    panel.model.origWidth = detail.width
                    panel.model.id = index
                    panel.model.module = detail.module
                    panel.refreshModel();
                    lonelyPanel = index
                }
                detail.id = index;
                index++;
            }
        }
        if (lonelyPanel === 0) removeList.add(panel)
    }
    state.panels = state.panels.filter(p => !removeList.has(p));
}

export function checkAllPanelsOnIntersection(state) {
    const panelList = state.status === Status.CREATE ? [...state.panels, state.curShape] : state.panels
    let multiply = 1
    for (const curShape of panelList) {
        var canBePlaced = false;
        let tableId = undefined;
        let nearestTable = undefined;
        curShape.setTableId(tableId)
        let minDist = 10000000000000000;
        for (let table of state.tables) {
            const dist = Geometry.rectToRectDist(curShape.outerRect.model, table.innerRect.model)
            if (dist < minDist) {
                nearestTable = table;
                minDist = dist
            }
           
            if (!canBePlaced) {
                canBePlaced = Geometry.rectInRect(curShape.outerRect.model, table.innerRect.model);
                if (canBePlaced || curShape.model.placedForce) {
                    tableId = table.getId();
                    multiply = table.model.multiply
                }
            }
        }
        canBePlaced = canBePlaced || state.settings.allPlacedForce
        if (curShape.model.placedForce || state.settings.allPlacedForce) {
            tableId = nearestTable.getId();
            multiply = nearestTable.model.multiply
        }
        if (canBePlaced || curShape.model.placedForce || state.settings.allPlacedForce) {
            for (let panel of panelList) {
                if (panel === curShape) continue;
                canBePlaced = !Geometry.rectIntersection(curShape.outerRect.model, panel.outerRect.model);
                if (canBePlaced || curShape.model.placedForce) { canBePlaced = !Geometry.rectInRect(curShape.outerRect.model, panel.outerRect.model) }
                canBePlaced = canBePlaced || state.settings.allPlacedForce
                if (!canBePlaced) break;
            }
        }
        curShape.setState({ canBePlaced });
        if (!canBePlaced && !curShape.model.placedForce && !state.settings.allPlacedForce) {
            if (tableId === undefined) curShape.state.message = "detailNotOnTable";
            else curShape.state.message = "detailOffsetError";
        }
        tableId = (canBePlaced || curShape.model.placedForce || state.settings.allPlacedForce) ? tableId : undefined
        curShape.setTableId(tableId)
        curShape.model.multiply = multiply;
    }
    state.tables.forEach(t => { t.setPanelList(panelList) });
}

export function updatePlacedDetails(state) {
    const panels = state.status === Status.CREATE ? [...state.panels, state.curShape] : state.panels
    for (const listKey of ["primary", "secondary"])
        for (const detail of state.detailList[listKey]) {
            detail.placed = 0;
            for (const panel of panels)
                if (panel.state.canBePlaced || panel.model.placedForce) {
                    panel.state.message = ""
                    if (detail.id === panel.getId() && listKey === panel.model.listKey) {
                        if ((detail.count - detail.placed) >= panel.model.multiply)
                            detail.placed += panel.model.multiply;
                        else {
                            panel.state.canBePlaced = false
                            panel.state.message = "detailComplectError"
                            state.tables.forEach(t => { t.setPanelList(panels) });
                        }
                    };
                }
        }
}