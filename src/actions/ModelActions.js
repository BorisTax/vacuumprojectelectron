export const ModelActions = {
    NEW_PROJECT: "NEW_PROJECT",
    NEW_PROJECT_CONFIRM: "NEW_PROJECT_CONFIRM",
    SAVE_PROJECT: "SAVE_PROJECT",
    OPEN_PROJECT: "OPEN_PROJECT",
    OPEN_FAILURE: "OPEN_FAILURE",
    SET_PROJECT: "SET_PROJECT",
    SET_INFORMATION: 'SET_INFORMATION',
    SET_MATERIAL: 'SET_MATERIAL',
    SET_DETAIL_PROPERTY: 'SET_DETAIL_PROPERTY',
    LOAD_DETAIL_LIST: 'LOAD_DETAIL_LIST',
    SET_DELETE_CONFIRM: 'SET_DELETE_CONFIRM',
    SET_ALLPLACEDFORCE: 'SET_ALLPLACEDFORCE',
    SET_DETAIL_LIST: 'SET_DETAIL_LIST',
    SET_DRAW_MODULE: 'SET_DRAW_MODULE',
    ADD_DETAIL: 'ADD_DETAIL',
    SET_ACTIVE_TABLE: "SET_ACTIVE_TABLE",
    SET_COMPLECT_COUNT: "SET_COMPLECT_COUNT",
    SET_TABLE_TYPE: "SET_TABLE_TYPE",
    DELETE_ACTIVE_TABLE: "DELETE_ACTIVE_TABLE",
    DELETE_TABLE_CONFIRM: "DELETE_TABLE_CONFIRM",
    DELETE_ROW: "DELETE_ROW",
    DELETE_ROW_CONFIRM: "DELETE_ROW_CONFIRM",
    ADD_TABLE: "ADD_TABLE",
    UPDATE_STATE: "UPDATE_STATE",
    deleteRow(listKey, id) {
        return {
            type: ModelActions.DELETE_ROW,
            payload: { listKey, id }
        }
    },
    deleteRowConfirm(listKey, param) {
        return {
            type: ModelActions.DELETE_ROW_CONFIRM,
            payload: { listKey, param }
        }
    },
    updateState() {
        return {
            type: ModelActions.UPDATE_STATE
        }
    },
    newProject() {
        return {
            type: ModelActions.NEW_PROJECT
        }
    },
    newProjectConfirm() {
        return {
            type: ModelActions.NEW_PROJECT_CONFIRM
        }
    },
    saveProject() {
        return {
            type: ModelActions.SAVE_PROJECT
        }
    },
    openProject() {
        return (dispatch) => {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = ".json";
            input.onchange = e => {
                const file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsText(file, 'UTF-8');

                // here we tell the reader what to do when it's done reading...
                reader.onload = readerEvent => {
                    try {
                        var content = JSON.parse(readerEvent.target.result);
                    } catch (e) {
                        content = {}
                    }
                    dispatch({ type: ModelActions.SET_PROJECT, payload: content });
                }
            }
            input.click();
        }
    },
    setInformation: (info) => {
        return {
            type: ModelActions.SET_INFORMATION,
            payload: info,
        }
    },
    setMaterial: (mat) => {
        return {
            type: ModelActions.SET_MATERIAL,
            payload: mat,
        }
    },
    setActiveTable: (tableId) => {
        return {
            type: ModelActions.SET_ACTIVE_TABLE,
            payload: tableId,
        }
    },
    setComplectCount: (count) => {
        return {
            type: ModelActions.SET_COMPLECT_COUNT,
            payload: count
        }
    },
    setTableType: (type) => {
        return {
            type: ModelActions.SET_TABLE_TYPE,
            payload: type
        }
    },
    setDeleteConfirm: (value) => {
        return {
            type: ModelActions.SET_DELETE_CONFIRM,
            payload: value
        }
    },
    setAllPlacedForce: (value) => {
        return {
            type: ModelActions.SET_ALLPLACEDFORCE,
            payload: value
        }
    },
    setDrawModule: (draw) => {
        return {
            type: ModelActions.SET_DRAW_MODULE,
            payload: draw
        }
    },
    addTable: () => {
        return {
            type: ModelActions.ADD_TABLE,
        }
    },
    deleteActiveTable: () => {
        return {
            type: ModelActions.DELETE_ACTIVE_TABLE,
        }
    },
    deleteTableConfirm: () => {
        return {
            type: ModelActions.DELETE_TABLE_CONFIRM,
        }
    },
    addDetail: (listKey) => {
        return {
            type: ModelActions.ADD_DETAIL,
            payload: { listKey },
        }
    },
    setDetailProperty: (index, key, value, listKey) => {
        return {
            type: ModelActions.SET_DETAIL_PROPERTY,
            payload: { index, key, value, listKey },
        }
    },
    loadDetailList: (listKey) => {
        return (dispatch) => {
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = ".list";
            input.onchange = e => {
                const file = e.target.files[0];
                var reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = readerEvent => {
                    var content = readerEvent.target.result;
                    dispatch({ type: ModelActions.SET_DETAIL_LIST, payload: { listKey, data: makeDetailList(content, listKey) } });
                }
            }
            input.click();
        }
    }
}

function makeDetailList(content, listKey) {
    let error = false;
    let info;
    const newList = []
    try {
        const lines = content.split('\r\n').filter((i, _) => i !== "")
        info = lines.filter((_, index) => index <= 4);
        info = info.map((i) => i.split('='));
        if ((info[0][0] !== "Order") || (info[1][0] !== "Plan") || (info[2][0] !== "Material") || (info[3][0] !== "Gloss") || (info[4][0] !== "Texture")) return { error: true }
        info = {
            order: info[0][1],
            plan: info[1][1],
            material: { name: info[2][1], gloss: info[3][1] === 'True' ? true : false, texture: info[4][1] === 'True' ? true : false }

            ,
        }

        let list = lines.filter((_, index) => index > 4);
        list = list.map((i) => i.split(';'))
        let index = 0;
        for (const i of list) {
            index++;
            newList.push({ listkey: listKey, module: i[0], id: index, name: i[1], length: +i[2], width: +i[3], count: +i[4], created: 0, placed: 0 })
        }
    } catch (e) { error = true }
    return { list: newList, info, error };
}

