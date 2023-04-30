import React from "react"

export default function Input(props) {
    const className = props.wide?"input-wide":""
    return <input
        className={className}
        disabled={props.disabled}
        value={props.value}
        onKeyDown={(e) => {
            e.stopPropagation()
            }}
        onChange={(e) => { props.onChange(e.target.value) }}
    />
}
