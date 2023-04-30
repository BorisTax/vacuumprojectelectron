export const ShapeActions = {
    CREATE_PANEL: 'CREATE_PANEL',
    MOVE_PANEL: "MOVE_PANEL",
    SELECT_PANEL: 'SELECT_PANEL',
    SET_PROPERTY: 'SET_PROPERTY',
    SET_PATH: 'SET_PATH',
    DELETE_PATH: 'DELETE_PATH',
    DELETE_PATH_CONFIRM: 'DELETE_PATH_CONFIRM',
    createPanel: (options) => {
        return {
            type: ShapeActions.CREATE_PANEL,
            payload: options,
        }
    },
    movePanel: (panel, movePoint) => {
        return {
            type: ShapeActions.MOVE_PANEL,
            payload: { panel, movePoint }
        };
    },
    setProperty: (prop) => {
        return {
            type: ShapeActions.SET_PROPERTY,
            payload: prop,
        }
    },
    deletePath: (listKey, detailId, deleteConfirm) => {
        return {
            type: deleteConfirm ? ShapeActions.DELETE_PATH_CONFIRM : ShapeActions.DELETE_PATH,
            payload: { listKey, detailId },
        }
    },
    openPath(listKey, detailId) {
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
                    dispatch({ type: ShapeActions.SET_PATH, payload: { listKey, detailId, path: content } });
                }
            }
            input.click();
        }
    },
}
