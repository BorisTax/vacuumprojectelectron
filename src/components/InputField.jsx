import React, { useState, useEffect } from "react"
import { RegExp } from "./shapes/PropertyData"
import { PropertyTypes } from "./shapes/PropertyData"
const {NUMBER, INTEGER_NUMBER, INTEGER_POSITIVE_NUMBER} = PropertyTypes

export default function InputField(props) {
    const [state, setState] = useState({ value: props.value, prevValue: props.value })
    const isNumber = (props.type === NUMBER)||(props.type === INTEGER_NUMBER)||(props.type === INTEGER_POSITIVE_NUMBER)
    useEffect(() => {
        setState({ prevValue: props.value, value: props.value })
    }, [props.value])
    const onChange = (v) => {
        if(v === "") {setState({ ...state, value: v }); return}
        let { value, correct } = test(v, props.type)
        if(isNumber) value = +value
        if (correct) setState({ ...state, value })
    }
    const onKeyPress = (key, value) => {
        if (key === "Enter") {
            const { correct } = test(value, props.type)
            if (correct && value !== "") {
                props.setValue(state.value);
                setState({ ...state, prevValue: state.value });
            }
            else {
                if(!isNumber) props.setValue(value);
                setState({ ...state, value: isNumber?state.prevValue:value})
            }
        }
    }
    const className = ((state.value !== state.prevValue) ? "input-cell-incorrect" : "input-cell") + (props.active?" active-input":"")

    return <input
        className={className}
        disabled={props.disabled}
        value={state.value}
        onKeyPress={(e) => {
            onKeyPress(e.key, e.target.value);
            e.stopPropagation()
            }}
        onKeyDown={(e) => {
            e.stopPropagation()
            }}
        onBlur={() => {
            setState({ ...state, value: state.prevValue });
            }}
        onChange={(e) => { onChange(e.target.value) }}
        onFocus={()=>{if(props.onFocus) props.onFocus()}}
    />
}

function test(value, type) {
    const regexp = RegExp[type];
    const result = { value, correct: false }
    if ((`${value}`.match(regexp) !== null) || value === "") { result.correct = true }
    return result;
}