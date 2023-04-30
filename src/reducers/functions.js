

export const Status = {
    FREE: 'FREE',
    SELECT: 'SELECT',
    CREATE: 'CREATE',
    DRAWING: 'DRAWING',
    CANCEL: 'CANCEL',
    PAN: 'PAN',
    MEASURE: 'MEASURE',
}

export const getNewDate = ()=>{
    return new Date().toISOString().substr(0, 10)
}

export function setMaterial(state, material) {
    const panelMargin = material.gloss ? 100 : 80
    const newState = { ...state, material: { ...material, force: false }, panelMargin: panelMargin }
    for (const t of newState.tables) {
        t.model.marginLength = newState.tableMarginLength - panelMargin / 2;
        t.model.marginWidth = newState.tableMarginWidth - panelMargin / 2;
        t.refreshModel();
    }
    for (const p of newState.panels) {
        p.model.margin = panelMargin / 2;
        p.refreshModel()
    }
    for (const listKey of ["primary", "secondary"])
        for (const det of newState.detailList[listKey]) {
            det["margin"] = panelMargin / 2;
        }
    return newState;
}

export function isMobile(){
    return (navigator.maxTouchPoints > 1) 
}



