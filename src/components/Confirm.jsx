import React from 'react';
import {AppActions} from '../actions/AppActions';
import {  useDispatch, useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';

export default function Confirm(props){
        const dispatch = useDispatch()
        const appActions = useActions()
        const captions = useSelector(store => store.captions)
        return <div className='modal-container  noselect' onClick={AppActions.blink} >
                    <div className={"toolbar-modal shadow-box"} onClick={(e)=>{e.stopPropagation()}}>
                      <div style={{maxWidth:"400px",wordWrap:"break-word",textAlign:"center"}}>{captions.messages[props.messageKey]}</div>
                        <div className="flex-center">
                        {props.actions.map((action, index)=>
                            <button key={index} 
                                    onClick={()=>{
                                        dispatch(action.onClick());
                                        appActions.showConfirm(false)}}>
                                    {action.caption}
                            </button>)}
                        <button onClick={() => appActions.showConfirm(false)}>{captions.buttons.cancel}</button>
                        </div>
                    </div>
                </div>

}