import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import Input from './Input';
import ToolBar from './ToolBar';
export default function InformationBar({disabled}){
    const appData = useSelector(store => store)
    const captions = useSelector(store => store.captions.toolbars.info)
    const appActions = useActions()
    const info=appData.information
    return <ToolBar caption={captions.title}>
        <div className='info-container'>
            <div>{captions.order}</div>
            <Input value={info.order} disabled={disabled} onChange = {(value) => {appActions.setInformation({...info,order: value})}}/>
            <div>{captions.plan}</div>
            <Input value={info.plan} disabled={disabled} onChange = {(value) => {appActions.setInformation({...info, plan: value})}}/>
            <div>{captions.date}</div>
            <input type="date" value={info.currentDate} className = "date-input"
                disabled={disabled}
                onChange={(e)=>{
                    if(e.target.value!=="") appActions.setInformation({...info,currentDate:e.target.value})}}/>
        </div>
    </ToolBar>
}
