import React from 'react';
import { useToolTip } from '../customHooks/useToolTip';

export default function TextBox(props){
    const { onMouseOver, onMouseLeave } = useToolTip(props.title);
    const extClass = (props.extClass && Array.isArray(props.extClass))?props.extClass:[""]
    return <div 
            className={extClass.join(' ')}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            >
                {props.text}
            </div>
}

