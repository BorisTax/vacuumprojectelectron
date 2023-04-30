import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ViewPort from './ViewPort'
import { pointerMove, pointerDown, pointerUp, pointerLeave, pointerEnter, mouseWheel, click, doubleClick, keyDown, keyPress, keyUp } from "../functions/viewPortHandlers";
import { zoomToTable } from "../functions/viewPortFunctions";
import TouchManager from "../handlers/TouchManager";
import useActions from "../customHooks/useActions";

const initialState = {
    curRealPoint: { x: 0, y: 0 },
    curCanvasPoint: { x: 225, y: 225 },
    gridStep: 10,
    gridStepPixels: 1,
    marginTop: 15, marginLeft: 0, marginBottom: 0, marginRight: 0,
    ratio: 1, pixelRatio: 1,
    realWidth: 3500, realHeight: 3500,
    viewPortHeight: 400,
    viewPortWidth: 550,
    selectDist: 2,
    snapDist: 20, snapMinDist: 10,
    topLeft: { x: -400, y: 200 },
    bottomRight: { x: 3100, y: -3300 },
    touchManager: new TouchManager(),
}

export default function ViewPortContainer() {
    const [viewPortData, setViewPortData] = useState(initialState)
    const props = useRef()
    const appDataRef = useRef()
    const appData = useSelector(store => store)
    appDataRef.current = appData
    const appActions = useActions()
    const mouseHandler = appData.mouseHandler
    props.current = { mouseHandler, viewPortData, setViewPortData, appActions, appData }
    useEffect(() => {
        window.addEventListener('keypress', (e) => { keyPress(e, { mouseHandler }) })
        window.addEventListener('keydown', (e) => { keyDown(e, { appData: appDataRef.current, appActions }) })
        window.addEventListener('keyup', (e) => { keyUp(e, { appData }) })
    }, [])
    useEffect(() => {
        const tableRect = appData.tables.find(t => t.model.id === appData.activeTable).outerRect.model;
        setViewPortData(prevData => zoomToTable(tableRect, prevData))
    }, [appData.goToActiveTable])
    const eventHandlers = {
        onPointerMove: (e) => { pointerMove(e, props.current) },
        onPointerDown: (e) => { pointerDown(e, props.current) },
        onPointerUp: (e) => { pointerUp(e, props.current) },
        onMouseWheel: (e) => { mouseWheel(e, props.current) },
        onPointerLeave: (e) => { pointerLeave(e, props.current) },
        onPointerEnter: (e) => { pointerEnter(e, props.current) },
        onClick: (e) => { click(e, props.current) },
        onDoubleClick: (e) => { doubleClick(e, props.current) },
    }
    return <ViewPort
        appData={appData}
        appActions={appActions}
        viewPortData={viewPortData}
        setViewPortData={setViewPortData}
        eventHandlers={eventHandlers}
    />
}

