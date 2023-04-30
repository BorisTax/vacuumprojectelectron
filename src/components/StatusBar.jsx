import React from 'react';
import { useSelector } from 'react-redux';
import ToolBar from './ToolBar';

export default function StatusBar() {
    const appData = useSelector(store => store)
    const lines = appData.mouseHandler.statusBar
    return <ToolBar noTitle={true} font={"small"} wide={true} extClassName='status-bar'>
        <div className={'status-bar-content'}>
            {lines && lines.map((line, index) =>
                <div key={index} style={{ marginRight: "5px", display: "flex", flexDirection: "row", alignItems: "center", color: line.warn ? "red" : "black" }}>
                    {line.icons.map(icon => <img id={icon} key={icon} alt="" />)}
                    {line.text}
                </div>)}
        </div>
    </ToolBar>

}
