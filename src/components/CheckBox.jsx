import React, { useId, useRef } from 'react';

export default function CheckBox({value, title, onChange}){
    const id = useId();
    const checkboxRef = useRef()
    return (
        <div className="checkbox noselect">
            <input ref={checkboxRef} className="checkbox-input" type="checkbox" id={id} checked={value} onChange={(e) => { onChange(e.target.checked); e.target.blur() }} />
            <label className="checkbox-label" htmlFor={id}></label>
            <span className="checkbox-title" onClick={() => {onChange(!checkboxRef.current.checked)}}>{title}</span>
        </div>
    );
}

