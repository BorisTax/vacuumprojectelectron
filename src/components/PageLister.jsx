import React from 'react';
import ToolButton from './ToolButton';

export default function PageLister(props) {
    return <div style={{ display: "flex", alignItems: "center" }}>
        <ToolButton icon="left" disabled={props.disabled} onClick={() => { if (props.current > 0) props.setCurrent(props.current - 1) }} />
        <div>{`${props.current + 1} из ${props.count}`}</div>
        <ToolButton icon="right" disabled={props.disabled} onClick={() => { if (props.current < (props.count - 1)) props.setCurrent(props.current + 1) }} />
    </div>

}