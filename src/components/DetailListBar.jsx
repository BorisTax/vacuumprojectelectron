import React, { useState } from 'react';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import DetailList from './DetailList';
import useActions from '../customHooks/useActions';
import { useSelector } from 'react-redux';
import ToolButtonBar from './ToolButtonBar';

export default function DetailListBar({disabled, listKey, caption}){
    const appActions = useActions()
    const captions = useSelector(store => store.captions.toolbars.detailList)
    const details = useSelector(store => store.detailList[listKey])
    const noDetails = (details.length === 0)
    const [active, setActive] = useState({row: 0, id: details[0]?details[0].id:0})
    const deleteConfirm = useSelector(store => store.deleteConfirm)
    if(details.every(d => d.id !== active.id)) {active.row = 0; active.id = details[0]?details[0].id:0} //after deleting row
    if(details[active.row]){
        var created_all = details[active.row].created >= details[active.row].count;
        var placed_all = details[active.row].placed >= details[active.row].count;
    }else{
        created_all = false
        placed_all = false
    }
    const hasPath = details[active.row] ? details[active.row].innerGlossPath : false
    const contents =  <div>
                        <ToolButtonBar>
                            <ToolButton disabled={disabled} icon="add" title={captions.add} onClick={()=>{appActions.addDetail(listKey)}}/>
                            <ToolButton disabled={disabled||noDetails} icon="delete" 
                                            title={captions.delete}
                                                onClick={()=>{deleteConfirm ? appActions.deleteRowConfirm(listKey, active) : appActions.deleteRow(listKey, active.id)}}
                                            />
                            <ToolButton disabled={disabled||created_all||placed_all||noDetails} icon={placed_all?"placedAllPanels":created_all?"created-all-panels":"createPanel"} 
                                        title={placed_all?captions.allPlaced:created_all?captions.allCreated:captions.place}
                                            onClick={()=>{appActions.createPanel(details[active.row])}}
                                        />         
                            <ToolButton disabled={disabled||noDetails} icon={hasPath ? "delete_path" : "open_path"} 
                                    title={hasPath ? captions.deletePath : captions.openPath}
                                        onClick={()=>{hasPath ? appActions.deletePath(listKey, details[active.row].id, deleteConfirm) : appActions.openPath(listKey, details[active.row].id)}}
                                        />           
                        </ToolButtonBar>
                        <div className="detail-list-container">
                    <DetailList disabled={disabled} listKey={listKey} active={active} setActive={(param) => setActive(_ => param)}/>
                    </div>
                    </div>
    return <ToolBar caption={caption}>
            {contents}
    </ToolBar>

}
