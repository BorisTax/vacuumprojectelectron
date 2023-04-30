export default class KeyHandler {

    keyPress(e, { handler }) {
        if (handler.keypress(e.code))
            if (e.target === document.body) e.preventDefault();
    };

    keyUp(e, { appData }) {
        //appData.cursor.setAdditional({ shiftKey: e.shiftKey, altKey: e.altKey });
    };

    keyDown(e, { appData, appActions}) {
        if (window.KEYDOWNHANDLE === false) return;
    }
}

