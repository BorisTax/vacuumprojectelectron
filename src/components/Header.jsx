import React from 'react';
import { useSelector } from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';

const Header =  ()=>{
    const captions = useSelector(store => store.captions.help)
    const title = useSelector(store => store.captions.title)
    const appActions = useActions()
        return <div className={"header"}>
            <ToolBar noTitle={true} wide={true}>
                <div style={{display:"flex", flexWrap:"none", gap: "1em", alignItems:"center", width:"100%"}}>
                    <div className='title'>{title}</div>
                    <ToolButton icon="help" title={captions.title} onClick={()=>{appActions.showHelp(true)}}/>
                </div>
            </ToolBar>
        </div>
}

export default Header;