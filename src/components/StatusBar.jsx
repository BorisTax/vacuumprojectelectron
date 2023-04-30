import React from 'react';
import { useSelector } from 'react-redux';
import ToolBar from './ToolBar';

export default function StatusBar() {
    const appData = useSelector(store => store)
    const lines = appData.mouseHandler.statusBar
    return <ToolBar noTitle={true} font={"small"} wide={true}>
        <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "20px", fontSize: "medium", minHeight: "25px", maxHeight: "25px" }}>
            {lines && lines.map((line, index) =>
                <div key={index} style={{ marginRight: "5px", display: "flex", flexDirection: "row", alignItems: "center", color: line.warn ? "red" : "black" }}>
                    {line.icons.map(icon => <img id={icon} key={icon} alt="" />)}
                    {line.text}
                </div>)}
        </div>
    </ToolBar>

}
