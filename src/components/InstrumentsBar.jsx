import React from 'react';
import { useSelector } from 'react-redux';
import { Status } from '../reducers/functions';
import useActions from '../customHooks/useActions';
import ToolBar from './ToolBar';
import ToolButton from './ToolButton';
import ToolButtonRow from './ToolButtonRow';

const InstrumentsBar=(props)=>{
    const appActions = useActions()
    const appData = useSelector(store => store)
    const captions = useSelector(store => store.captions.toolbars.operations)
    const selected = (props.selectedPanels.length > 0)
    const texture = appData.material.texture
    const measure = (appData.status === Status.MEASURE)
    const disabled = props.disabled&&!measure
    const measureid = measure?"measure_cancel":"measure"
    const measureTitle = measure?captions.measureStop:captions.measure
    const rotateTitle = texture?captions.norotate:captions.rotate
    return <ToolBar caption={captions.title}>
        <ToolButtonRow>
            <ToolButton icon={measureid} title={measureTitle} disabled={disabled} onClick={()=>{measure?appActions.cancel():appActions.startMeasuring();}}/>
            <ToolButton icon={"flip"} title={rotateTitle} disabled={props.disabled||!selected||texture} onClick={()=>{appActions.flipOrientation();}}/>
        </ToolButtonRow>
        </ToolBar>
}
export default InstrumentsBar;