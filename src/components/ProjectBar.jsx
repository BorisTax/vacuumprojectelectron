import React from 'react';
import { useSelector} from 'react-redux';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonBar from './ToolButtonBar';
import ToolButtonSeparator from './ToolButtonSeparator';

export default function ProjectBar({disabled}){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.project)
    return <ToolBar caption={captions.title}>
        <ToolButtonBar>
            <ToolButton icon="new" title={captions.new} onClick={()=>{appActions.new()}} disabled={disabled}/>
            <ToolButton icon="open" title={captions.open} onClick={()=>{appActions.open()}} disabled={disabled}/>
            <ToolButton icon="save" title={captions.save} onClick={()=>{appActions.save()}} disabled={disabled}/>
            <ToolButtonSeparator/>
            <ToolButton icon="preview" title={captions.preview} onClick={()=>{appActions.print({save:false})}} disabled={disabled}/>
            <ToolButton icon="save-pdf" title={captions.savePdf} onClick={()=>{appActions.print({save:true})}} disabled={disabled}/>
            <ToolButtonSeparator/>
            </ToolButtonBar>
        </ToolBar>
}
