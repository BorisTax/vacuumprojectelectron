import React, { useId, useState } from 'react';

export default function ToolBar({ id, expanded = true, expandable = true, caption, font, noTitle, wide, children }) {
        const [expand, setExpanded] = useState(expanded)
        if(!id) id = useId()
        const contents = expand ? children : <></>
        return <div id={id} className={`${wide?'toolbar-wide':'toolbar'} noselect`}>
                {!noTitle ?
                        <>
                        <div className={`${expandable?'toolbar-header-expandable':'toolbar-header'}`} style={{ fontSize: font }} onClick={() => { if(expandable) setExpanded(!expand) }}>
                                <div className={"noselect"} >{caption}&nbsp;&nbsp;</div>
                        </div>
                        <hr />
                        </>
                        : <></>}
                {contents}
        </div>
}

