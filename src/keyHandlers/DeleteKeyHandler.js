import KeyHandler from "./KeyHandler";

export default class DeleteKeyHandler extends KeyHandler {
    keyPress(e, { handler }) {
        super.keyPress(e, {handler})
    };

    keyUp(e, { appData }) {
        super.keyUp(e)
    };

    keyDown(e, { appData, appActions }) {
        if (super.keyDown(e, { appData, appActions })) return
        appData.deleteConfirm ? appActions.deleteConfirm() : appActions.deleteSelectedPanels()
    }
}