import { getPoint } from "./viewPortFunctions";
import { keyHandlers } from "../keyHandlers/options";

export function pointerMove(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    const curPoint = getPoint(e)
    if (e.pointerType === "touch")
        mouseHandler.touchMove({ pointerId: e.pointerId, curPoint, viewPortData, setViewPortData, appActions, appData });
    else
        mouseHandler.move({
            curPoint, viewPortData, setViewPortData, appActions, appData,
            keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey }
        })
}
export function pointerDown(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    const curPoint = getPoint(e)
    if (e.pointerType === "touch")
        mouseHandler.touchDown({ pointerId: e.pointerId, curPoint: curPoint, viewPortData, setViewPortData, appActions, appData });
    else
        mouseHandler.down({ button: e.button, curPoint: curPoint, viewPortData, setViewPortData, appActions, appData, keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey } });
    if(e.button === 1) e.preventDefault();
}

export function pointerUp(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    const curPoint = getPoint(e)
    if (e.pointerType === "touch")
        mouseHandler.touchUp({ pointerId: e.pointerId, curPoint, viewPortData, setViewPortData, appActions, appData });
    else
        mouseHandler.up({ button: e.button, curPoint, viewPortData, setViewPortData, appActions, appData });
}

export function mouseWheel(e, { mouseHandler, viewPortData, setViewPortData, appActions }) {
    const curPoint = getPoint(e)
    mouseHandler.wheel({ deltaY: e.deltaY, curPoint, viewPortData, setViewPortData, appActions, keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey } })
    e.preventDefault();
}
export function pointerLeave(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    if (e.pointerType === "touch")
        mouseHandler.touchUp({ pointerId: e.pointerId, viewPortData, setViewPortData, appActions, appData });
    else
        mouseHandler.leave({ viewPortData, appActions });
}

export function pointerEnter(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
}

export function click(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    const curPoint = getPoint(e)
    mouseHandler.click({ button: e.button, curPoint, viewPortData, setViewPortData, appActions, appData, keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey } });
}

export function doubleClick(e, { mouseHandler, viewPortData, setViewPortData, appActions, appData }) {
    const curPoint = getPoint(e)
    if (e.pointerType === "touch")
        mouseHandler.doubleClick({ button: 0, curPoint, viewPortData, setViewPortData, appActions, appData, keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey } });
    else
        mouseHandler.doubleClick({ button: e.button, curPoint, viewPortData, setViewPortData, appActions, appData, keys: { shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, altKey: e.altKey } });
}

export function keyPress(e, { mouseHandler }) {
    if (mouseHandler.keypress(e.code))
        if (e.target === document.body) e.preventDefault();
};

export function keyUp(e, { appData }) {
    //appData.cursor.setAdditional({ shiftKey: e.shiftKey, altKey: e.altKey });
};

export function keyDown(e, { appData, appActions }) {
    if (window.KEYDOWNHANDLE === false) return;
    appData.cursor.setAdditional({ shiftKey: e.shiftKey, altKey: e.altKey });
    keyHandlers.forEach(key => {
        if (e.ctrlKey === key.ctrlKey && e.shiftKey === key.shiftKey && e.altKey === key.altKey && e.keyCode === key.keyCode) {
            const keyHandler = new key.handler()
            keyHandler.keyDown(e, { appData, appActions })
            e.preventDefault();
        }
    })
}