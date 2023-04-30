import React from 'react';

export default function ComboBox(props) {
    const options = props.items.map((i, index) =>
        <option key={index} >{i}</option>
    )
    return (
        <>
            {props.title ? <span>{props.title}</span> : <></>}
            <select className={'combobox'} size={!props.size ? 1 : props.size}
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => {
                    const index = props.items.findIndex(i => i === e.target.value) || 0
                    props.onChange(index, e.target.value)
                }}>
                {options}
            </select>

        </>
    );
}

