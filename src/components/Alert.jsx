import React from 'react';
import {AppActions} from '../actions/AppActions';
import useActions from '../customHooks/useActions';

export default function Alert(props){
    const appActions = useActions()
    return <div className='modal-container noselect' onClick={AppActions.blink}>
                <div className={"toolbar-modal shadow-box"} onClick={(e)=>{e.stopPropagation()}}>
                    <div>{props.message}</div>
                    <div className="flex-center">
                    <button onClick={()=>{
                        appActions.showAlert(false)}}>OK</button>
                    </div>    
                </div>
            </div>
}