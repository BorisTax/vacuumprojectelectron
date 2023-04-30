import React from 'react';

export default function ToolButtonBar(props) {
        return <>
                <div style={{ display: "flex", alignItems: "stretch" }}>
                        {props.children}
                </div>
                <hr />
        </>
}
