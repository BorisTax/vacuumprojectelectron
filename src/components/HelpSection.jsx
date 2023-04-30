import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';

export default function HelpSection(){
    const appActions = useActions()
    const captions = useSelector(store => store.captions)
    const title = useSelector(store => store.captions.title)
    const keys = captions.help.hotKeys.map((item,i)=><Fragment key={i}><span className='helpHotKey'>{item.key} </span> - {item.desc}<br/></Fragment>);
    return <div className='modal-container help-container noselect' onClick={()=>{appActions.showHelp(false)}}>
                <div className={"toolbar help-section"}>
                    <div className={"toolbar-header flex-center"}>
                        <span className={"toolbarCaption"}>{captions.help.title}</span>

                    </div>
                <hr/>
                    <div style={{display:"flex", gap:"1em"}}>
                    <span  style={{fontSize:"medium",fontWeight:"bold",color:"blue", textAlign:"right"}}>{title}</span>  
                        <span>{captions.about.name}</span> 
                        <a href={`mailto: ${captions.about.email}`}>{captions.about.email}</a>
                    </div>
                <hr/>
                
                {keys}
                </div>
    </div>
}
