import React from 'react';
import { PropertyTypes } from './shapes/PropertyData';
import useActions from '../customHooks/useActions';
import { useSelector } from 'react-redux';
import TextBox from './TextBox';
import InputField from './InputField';

export default function DetailRow({active, setActive, disabled, rowIndex, detail, listKey}){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.detailList)
    const setValue = (rowIndex,key,value) => {
        appActions.setDetailProperty(rowIndex,key,value,listKey);
    }
    const hasPath = !!detail.innerGlossPath
    const textboxClass = active?"active-input":""
    const textboxPlacedClass = (detail.placed === detail.count)?'textbox-ok':'textbox-not-ok'
    return [
                <TextBox key={`${detail.id}-${0}`} text={detail.id}  textAlign="center" extClass={[textboxClass]}/>,
                <InputField key={`${detail.id}-${1}`} active={active} disabled={disabled} rowId={detail.id} value={detail.module} type={PropertyTypes.STRING} setValue={(value)=>{setValue(rowIndex,"module",value)}} onFocus={()=>setActive({row: rowIndex, id: detail.id})}/>,
                <InputField key={`${detail.id}-${2}`} active={active} disabled={disabled || hasPath} rowId={detail.id} value={detail.length} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} setValue={(value)=>{setValue(rowIndex,"length",value)}} onFocus={()=>setActive({row: rowIndex, id: detail.id})}/>,
                <InputField key={`${detail.id}-${3}`} active={active} disabled={disabled || hasPath} rowId={detail.id} value={detail.width} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} setValue={(value)=>{setValue(rowIndex,"width",value)}} onFocus={()=>setActive({row: rowIndex, id: detail.id})}/>,
                <InputField key={`${detail.id}-${4}`} active={active} disabled={disabled} rowId={detail.id} value={detail.count} type={PropertyTypes.INTEGER_POSITIVE_NUMBER} setValue={(value)=>{setValue(rowIndex,"count",value)}} onFocus={()=>setActive({row: rowIndex, id: detail.id})}/>,
                <TextBox key={`${detail.id}-${5}`} title={captions.placedCorrectly} text={detail.placed} extClass={[textboxPlacedClass, textboxClass]}/>,
    ]

}
